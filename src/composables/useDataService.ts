import { ref } from 'vue';
import type { LocalUser } from '@/types/UserState';
import { Recipe } from '@/types/Recipes';
import { useRecipeStore } from '@/stores/recipe';
import axios from '@/axios';
import {
  GetUserDataResponse,
  StandardRecipeApiResponse,
  StandardUserApiResponse
} from '@/types/ApiResponse';
import { ObjectId } from 'bson';
import { useUserStore } from '@/stores/user';

  

/**
 * Handles all Data related API calls and initilizations
 * @todo split into user/recipe?
 * @returns - saveNewRecipe, updateUserRecipes, updateRecipe, getPublicRecipes, deleteRecipe,  getUserData, error
 * @example
 * const dataService = useDataService();
 * await dataService.saveNewRecipe(recipe);  
 */

export function useDataService() {

  const error = ref<string | null>(null);
  const recipeStore = useRecipeStore();
  const userStore = useUserStore();
  
  /**
   * Calls API to save newly created recipes
   * @param {Recipe} - The newly created recipe
   * @returns {Promise<void>} - None
   * @example
   * const dataService = useDataService();
   * await dataService.saveNewRecipe(recipe);
   */
  const saveNewRecipe = async (recipe: Recipe) => {
    try{
      const saveNewRecipeResponse = await axios.post<StandardRecipeApiResponse>('/new-recipe', {
        recipe
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const returnedData = saveNewRecipeResponse.data
      console.log('save recipe response: ', returnedData)

      if (!returnedData.success) throw new Error(`recipe save not successful: ${returnedData.message}`);

      const returnRecipe = returnedData.data;
      if (!returnRecipe) throw new Error('Recipe Returned Blank. Retry?')

      recipeStore.addRecipe(returnRecipe);
      recipeStore.removeTempLocalRecipe(recipe);
      recipeStore.cacheRecipeState();
    } catch(error) {
      console.log('Saving Recipe error: ', error); 
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
    try {
      const addUserRecipesResponse = await axios.patch<StandardUserApiResponse>('/user-recipes', {
        id: recipe._id.toString(),
        originalUserId: recipe.userId
      },{
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const user = addUserRecipesResponse.data.data;
      if (!user) throw new Error('Updated Data not found, retry, reset FE changes?')
      console.log('recipe:', recipe)
      recipeStore.cacheRecipeState();
      userStore.cacheUserState();
      return user;
    }catch (error) {
      console.log('upset user recipe error: ', error);
    }
  }

  /**
   * Calls API to update user's recipe data
   * @todo pass recipe Id in url. RESTapi
   * @param {Recipe} - The newly created recipe
   * @returns {Promise<void>} - None
   * @example
   * const dataService = useDataService();
   * await dataService.updateRecipe(recipe);
   */
  const updateRecipe = async (recipe: Recipe) => {
    try{
      console.log('trying to save recipe: ', recipe);
      // TODO change endpoint name, remove update
      const saveNewRecipeResponse = await axios.put<StandardRecipeApiResponse>('/update-recipe', {
        recipe
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const returnedData = saveNewRecipeResponse.data
      console.log('save recipe response: ', returnedData)

      if (!returnedData.success) throw new Error(`recipe upate not successful: ${returnedData.message}`);

      const returnedRecipe = returnedData.data;
      if (!returnedRecipe) throw new Error('Recipe Returned Blank. Retry?')

      recipeStore.updateRecipe(returnedRecipe);
      recipeStore.removeTempLocalRecipe(returnedRecipe);
      recipeStore.cacheRecipeState();
      userStore.cacheUserState();
    } catch(error) {
      console.log('Updating Recipe error: ', error);
      
    }
  };

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
    console.log('loading public recipes');
    const publicRecipeResponse = await axios.get('/public-recipes',
      {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    console.log(publicRecipeResponse.data);
    const publicRecipes = publicRecipeResponse.data;
    return publicRecipes;
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
    console.log('Load Authorized User Data')
    const userDataResponse = await axios.get('/user-data',
      {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const userData = userDataResponse.data.user;
      const userRecipes = userDataResponse.data.userRecipes;
      return {userData, userRecipes};
  }

  /**
   * Calls API to get delete a recipe
   * @param {ObjectId} - Recipe to be deleted's id
   * @returns {StandardRecipeApiResponse} - An res object htat includes 'success', 'message', and error data is success: false
   * @example
   * const dataService = useDataService();
   * const res = await dataService.deleteRecipe('1234abcd);
   */
  const deleteRecipe = async (id: ObjectId) => {
    try {
      const deletionResponse = await axios.delete<StandardRecipeApiResponse>('/recipe/' + id,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        });   
        console.log('DeletionResponse: ', deletionResponse);
        if (deletionResponse.data.success) recipeStore.finishRecipeDeletion();
        recipeStore.cacheRecipeState();
        return deletionResponse;
    } catch (error: unknown) {
      // check all Roll back Optimistic UI 
      console.log('error');
      recipeStore.revertRecipeDeletion(id);
      recipeStore.cacheRecipeState();
      throw new Error('deleting recipe Error: ');
    }
  }

  return { saveNewRecipe, updateUserRecipes, updateRecipe, getPublicRecipes, deleteRecipe,  getUserData, error }
}
