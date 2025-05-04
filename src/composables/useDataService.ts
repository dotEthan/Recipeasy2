import { ref } from "vue"
import type { LocalUser } from "@/types/UserState"
import { Recipe } from "@/types/Recipes"
import { useRecipeStore } from "@/stores/recipe"
import axios from "@/axios"
import {
  ImageUploadResponse,
  GetUserDataResponse,
  StandardRecipeApiResponse,
  StandardUserApiResponse,
  StandardApiResponse
} from "@/types/ApiResponse"
import { useUserStore } from "@/stores/user"
import { getPublicIdFromUrl } from "@/utilities"

/**
 * Handles all Data related API calls and initilizations
 * @todo split into user/recipe?
 * @todo remove error, tie into erorr store
 * @returns - saveNewRecipe, updateUserRecipes, updateRecipe, getPublicRecipes, deleteRecipe,  getUserData, error
 * @example
 * const dataService = useDataService();
 * await dataService.saveNewRecipe(recipe);
 */

export function useDataService() {
  const error = ref<string | null>(null)
  const recipeStore = useRecipeStore()
  const userStore = useUserStore()

  /**
   * Calls API to save newly created recipes
   * @param {Recipe} - The newly created recipe
   * @returns {Promise<void>} - None
   * @example
   * const dataService = useDataService();
   * await dataService.saveNewRecipe(recipe);
   */
  const saveNewRecipe = async (recipe: Recipe) => {
    try {
      const saveNewRecipeResponse = await axios.post<StandardRecipeApiResponse>("/recipes", {
        recipe
      });
      const returnedData = saveNewRecipeResponse.data;
      console.log("save recipe response: ", returnedData);
      if (!returnedData.success)
        throw new Error(`recipe save not successful: ${returnedData.message}`);

      const returnedRecipe = returnedData.recipe;
      if (!returnedRecipe) throw new Error("Recipe Returned Blank. Retry?");

      recipeStore.finishSuccessfulSave(returnedRecipe);
      userStore.addIdToLocalUserRecipes(recipe._id);
      recipeStore.cacheRecipeState();
      userStore.cacheUserState();
    } catch (error) {
      console.log("Saving Recipe error: ", error);
      recipeStore.revertFailedSave(recipe);
      throw new Error(`Save New Recipe Fail: ${error}`);
    }
  }

  /**
   * Calls API to update User Object's 'recipes' array after adding public recipe to personal list
   * @param {Recipe} - The newly created recipe
   * @returns {Promise<LocalUser | undefined>} - After update made, the local User data is returned to ensure data consistency
   * @example
   * const dataService = useDataService();
   * await dataService.updateUserRecipes(recipe);
   */
  const updateUserRecipes = async (recipe: Recipe): Promise<LocalUser | undefined> => {
    const userId = userStore.getCurrentUserId
    try {
      const addUserRecipesResponse = await axios.patch<StandardUserApiResponse>(
        `/users/${userId}/recipes`,
        {
          recipeId: recipe._id.toString(),
          originalUserId: recipe.userId
        }
      )
      const user = addUserRecipesResponse.data.user
      if (!user) throw new Error("Updated Data not found, retry, reset FE changes?")
      userStore.setLocalUser(user)
      recipeStore.cacheRecipeState()
      userStore.cacheUserState()
      return user
    } catch (error) {
      console.log("upset user recipe error: ", error)
    }
  }

  /**
   * Calls API to update recipe data
   * @todo Figure out revertFailedUpdate properly
   * @param {Recipe} - The newly created recipe
   * @returns {Promise<void>} - None
   * @example
   * const dataService = useDataService();
   * await dataService.updateRecipe(recipe);
   */
  const updateRecipe = async (recipe: Recipe) => {
    try {
      console.log("trying to save recipe: ", recipe)
      const saveNewRecipeResponse = await axios.put<StandardRecipeApiResponse>(
        `/recipes/${recipe._id}`,
        {
          recipe
        }
      )
      const returnedData = saveNewRecipeResponse.data
      console.log("save recipe response: ", returnedData)

      if (!returnedData.success)
        throw new Error(`recipe update not successful: ${returnedData.message}`)

      const returnedRecipe = returnedData.recipe
      if (!returnedRecipe) throw new Error("Recipe Returned Blank. Possible?")

      if (returnedRecipe.userId === userStore.getCurrentUserId) {
        recipeStore.updatePublicRecipe(returnedRecipe)
      }
      recipeStore.finishSuccessfulUpdate(returnedRecipe);
      recipeStore.cacheRecipeState();
    } catch (error) {
      console.log("Updating Recipe error: ", error)
      recipeStore.revertFailedUpdate(recipe)
      recipeStore.cacheRecipeState()
    }
  }

  /**
   * Calls API to get various public recipes to populate front page
   * @todo implement proper fetching using tags
   * @param {} - None
   * @returns {Promise<Recipe[]>} - An array of public recipes to use
   * @example
   * const dataService = useDataService();
   * await dataService.getPublicRecipes();
   */
  const getPublicRecipes = async (): Promise<Recipe[]> => {
    console.log("loading public recipes")
    // TODO add ?page=0?limit=50
    const publicRecipeResponse = await axios.get("/recipes?visibility=public&page=1&limit=25")
    console.log(publicRecipeResponse.data)
    const publicRecipes = publicRecipeResponse.data
    return publicRecipes
  }

  /**
   * Calls API to get User Data for logged in user
   * @param {} - None
   * @returns {Promise<GetUserDataResponse>} - An object that includes userData and userRecipes
   * @example
   * const dataService = useDataService();
   * const { userData, userRecipes } = await dataService.getUserData();
   */
  const getUserData = async (): Promise<GetUserDataResponse> => {
    const userId = userStore.getCurrentUserId
    if (!userId) throw new Error("No userid to get, relogin")
    console.log("Load Authorized User Data: ", userId)
    const userDataResponse = await axios.get(`/users/${userId.toString()}`)
    const userData = userDataResponse.data.user
    const userRecipes = userDataResponse.data.userRecipes
    return { userData, userRecipes }
  }

  /**
   * Calls API to get delete a recipe
   * @todo error handling
   * @todo Optimistic UI & Revert
   * @param {string} - Recipe to be deleted's id
   * @returns {StandardRecipeApiResponse} - An res object htat includes 'success', 'message', and error data is success: false
   * @example
   * const dataService = useDataService();
   * const res = await dataService.deleteRecipe('1234abcd);
   */
  const deleteRecipe = async (id: string) => {
    try {
      await axios.delete(`/recipes/${id}`)
      console.log("Deletion successful")
      recipeStore.finishRecipeDeletion()
      userStore.removeIdFromLocalUserRecipes(id)
      userStore.cacheUserState()
      recipeStore.cacheRecipeState()
    } catch (error: unknown) {
      // check all Roll back Optimistic UI
      console.log("error")
      recipeStore.revertRecipeDeletion(id)
      recipeStore.cacheRecipeState()

      throw new Error("deleting recipe Error: ")
    }
  }

  const uploadRecipeImage = async (image: File): Promise<string> => {
    try {
      console.log("uploading")
      const formData = new FormData()
      formData.append("image", image)

      const { data } = await axios.post<ImageUploadResponse | null>(
        "/recipes/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )
      if (!data || !data.success) throw new Error("uploadRecipeImage - Upload Failed")
      console.log("imageUploadRes: ", data)

      return data.url
    } catch (error) {
      throw new Error("uploadRecipeImage - Image Upload failed")
    }
  }

  const deleteRecipeImage = async (path: string): Promise<void> => {
    try {
      const publicId = getPublicIdFromUrl(path);
      console.log('recipe id: ', publicId)
      const encodedPublicId = encodeURIComponent(publicId);
      const { data } = await axios.delete<StandardApiResponse>(`recipes/image/${encodedPublicId}`)
      if (!data.success) console.log('Background image delete failed')
    } catch (error) {
      throw new Error("deleteRecipeImage - deletion not successful")
    }
  }

  return {
    saveNewRecipe,
    updateUserRecipes,
    updateRecipe,
    getPublicRecipes,
    deleteRecipe,
    getUserData,
    uploadRecipeImage,
    deleteRecipeImage,
    error
  }
}
