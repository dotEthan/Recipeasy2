import { ref } from "vue";

import axios from "@/axios";
import { useAppStore } from "@/stores/appStore";
import { useErrorStore } from "@/stores/errorStore";
import { useRecipeStore } from "@/stores/recipeStore";
import { useToastStore } from "@/stores/toastStore";
import { useUserStore } from "@/stores/userStore";
import {
  GetUserDataResponse,
  ImageUploadResponse,
  StandardApiResponse,
  StandardRecipeApiResponse,
  StandardUserApiResponse
} from "@/types/ApiResponse.d";
import { MealTime, Recipe, Visibility } from "@/types/Recipes.d";
import { ToastType } from "@/types/Toasts";
import type { LocalUser } from "@/types/UserState.d";
import { getPublicIdFromUrl } from "@/utilities";
import { handleError } from "@/utilities/ErrorHandler";

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
  const error = ref<string | null>(null);
  const recipeStore = useRecipeStore();
  const userStore = useUserStore();
  const errorStore = useErrorStore();
  const toastStore = useToastStore();
  const appStore = useAppStore();

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
      if (!returnedData.success)
        throw new Error(`recipe save not successful: ${returnedData.message}`);

      const returnedRecipe = returnedData.recipe;
      if (!returnedRecipe) throw new Error("Recipe Returned Blank. Retry?");

      recipeStore.finishSuccessfulSave(returnedRecipe);
      userStore.addIdToLocalUserRecipes(recipe._id);
      toastStore.showToast("New Recipe Created", ToastType.SUCCESS);
    } catch (error) {
      recipeStore.revertFailedSave(recipe);

      console.log("Saving Recipe error: ", error);
      throw new Error(`Save New Recipe Fail: ${error}`);
    }
  };

  /**
   * Calls API to update User Object's 'recipes' array after adding public recipe to personal list
   * @param {Recipe} - The newly created recipe
   * @returns {Promise<LocalUser | undefined>} - After update made, the local User data is returned to ensure data consistency
   * @example
   * const dataService = useDataService();
   * await dataService.updateUserRecipes(recipe);
   */
  const updateUserRecipes = async (recipe: Recipe): Promise<LocalUser | undefined> => {
    const userId = userStore.getCurrentUserId;
    try {
      const addUserRecipesResponse = await axios.patch<StandardUserApiResponse>(
        `/users/${userId}/recipes`,
        {
          recipeId: recipe._id.toString(),
          originalUserId: recipe.userId
        }
      );
      const user = addUserRecipesResponse.data.user;
      if (!user) throw new Error("Updated Data not found, retry, reset FE changes?");
      userStore.setLocalUser(user);
      toastStore.showToast("Public recipe added", ToastType.SUCCESS);
      return user;
    } catch (error) {
      console.log("upset user recipe error: ", error);
    }
  };

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
      const saveNewRecipeResponse = await axios.put<StandardRecipeApiResponse>(
        `/recipes/${recipe._id}`,
        {
          recipe
        }
      );
      const returnedData = saveNewRecipeResponse.data;

      if (!returnedData.success)
        throw new Error(`recipe update not successful: ${returnedData.message}`);

      const returnedRecipe = returnedData.recipe;
      if (!returnedRecipe) throw new Error("Recipe Returned Blank. Possible?");

      if (returnedRecipe.userId === userStore.getCurrentUserId) {
        recipeStore.updatePublicRecipe(returnedRecipe);
      }
      recipeStore.finishSuccessfulUpdate(returnedRecipe);
      toastStore.showToast("Recipe Updated", ToastType.SUCCESS);
    } catch (error) {
      console.log("Updating Recipe error: ", error);
      recipeStore.revertFailedUpdate(recipe);
    }
  };

  /**
   * Calls API to get various public recipes to populate front page
   * @todo implement proper fetching using tags
   * @todo Implment pagination
   * @param {} - None
   * @returns {Promise<Recipe[]>} - An array of public recipes to use
   * @example
   * const dataService = useDataService();
   * await dataService.getPublicRecipes();
   */
  const getPublicRecipes = async (): Promise<Recipe[] | undefined> => {
    try {
      const publicRecipeResponse = await axios.get("/recipes?visibility=public&page=1&limit=25");
      const publicRecipes = publicRecipeResponse.data;
      recipeStore.setInitialPublicRecipeState(publicRecipes);
      errorStore.hideCriticalErrorModal();
      return publicRecipes;
    } catch (error) {
      handleError(error, {
        showRetry: true,
        showCancel: true,
        onRetry: () => getPublicRecipes(),
        onCancel: () => errorStore.hideCriticalErrorModal()
      });
    }
  };

  /**
   * Calls API to get public recipes based on tags
   * @param {string[]} tags - array of tags to use to search
   * @returns {Promise<Recipe[]>} - An array of public recipes to use
   * @example
   * const dataService = useDataService();
   * await dataService.getRecipesByTag(tags);
   */
  const getPublicRecipesByTag = async (tags: String[]): Promise<Recipe[] | undefined> => {
    try {
      const getRecipeByTagResponse = await axios.get("/recipes", {
        params: {
          visibility: Visibility.Public,
          limit: 5,
          tags: tags
        }
      });
      return getRecipeByTagResponse.data as Recipe[];
    } catch (error) {
      handleError(error, {
        showRetry: true,
        showCancel: true,
        onRetry: () => getPublicRecipesByTag(tags),
        onCancel: () => errorStore.hideCriticalErrorModal()
      });
    }
  };

  /**
   * Get recipes for each front page collection
   * @param {string[]} tags - tags associated to collection
   * @returns {Promise<Recipe[]>} - An array of public recipes to use
   * @example
   * const dataService = useDataService();
   * await dataService.getRecipesForCollections(tags);
   */
  const getRecipesForCollections = async (
    tags: String[] | MealTime
  ): Promise<Recipe[] | undefined> => {
    try {
      const limit = appStore.recipesPerCollection;
      const getRecipeByTagResponse = await axios.get("/recipes/collections", {
        params: {
          visibility: Visibility.Public,
          limit: limit,
          tags: tags
        }
      });
      return getRecipeByTagResponse.data as Recipe[];
    } catch (error) {
      handleError(error, {
        showRetry: true,
        showCancel: true,
        onRetry: () => getRecipesForCollections(tags),
        onCancel: () => errorStore.hideCriticalErrorModal()
      });
    }
  };

  /**
   * Calls API to get User Data for logged in user
   * @param {} - None
   * @returns {Promise<GetUserDataResponse>} - An object that includes userData and userRecipes
   * @example
   * const dataService = useDataService();
   * const { userData, userRecipes } = await dataService.getUserData();
   */
  const getUserData = async (): Promise<GetUserDataResponse> => {
    const userId = userStore.getCurrentUserId;
    if (!userId) throw new Error("No userid to get, relogin");
    const userDataResponse = await axios.get(`/users/${userId.toString()}`);
    const userData = userDataResponse.data.user;
    const userRecipes = userDataResponse.data.userRecipes;
    return { userData, userRecipes };
  };

  /**
   * Calls API to get User Data for current user when id missing (data persistence)
   * @param {} - None
   * @returns {Promise<GetUserDataResponse>} - An object that includes userData and userRecipes
   * @example
   * const dataService = useDataService();
   * const { userData, userRecipes } = await dataService.getUserData();
   */
  const getCurrentUserData = async (): Promise<GetUserDataResponse | undefined> => {
    try {
      const userDataResponse = await axios.get("/users/me");
      const userData = userDataResponse.data.user;
      const userRecipes = userDataResponse.data.userRecipes;
      return { userData, userRecipes };
    } catch (error) {
      handleError(error, {
        showRetry: true,
        onRetry: () => getCurrentUserData()
      });
    }
  };

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
      await axios.delete(`/recipes/${id}`);
      recipeStore.finishRecipeDeletion();
      userStore.removeIdFromLocalUserRecipes(id);
      toastStore.showToast("Recipe Deleted", ToastType.SUCCESS);
    } catch (error: unknown) {
      recipeStore.revertRecipeDeletion(id);

      throw new Error("deleting recipe Error: ");
    }
  };

  const uploadRecipeImage = async (image: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("image", image);

      const { data } = await axios.post<ImageUploadResponse | null>("/recipes/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      if (!data || !data.success) throw new Error("uploadRecipeImage - Upload Failed");

      return data.url;
    } catch (error) {
      throw new Error("uploadRecipeImage - Image Upload failed");
    }
  };

  const deleteRecipeImage = async (path: string): Promise<void> => {
    try {
      const publicId = getPublicIdFromUrl(path);
      const encodedPublicId = encodeURIComponent(publicId);
      const { data } = await axios.delete<StandardApiResponse>(`recipes/image/${encodedPublicId}`);
      if (!data.success) console.log("Background image delete failed");
    } catch (error) {
      throw new Error("deleteRecipeImage - deletion not successful");
    }
  };

  return {
    saveNewRecipe,
    updateUserRecipes,
    updateRecipe,
    getPublicRecipes,
    getPublicRecipesByTag,
    getRecipesForCollections,
    deleteRecipe,
    getUserData,
    getCurrentUserData,
    uploadRecipeImage,
    deleteRecipeImage,
    error
  };
}
