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

export function useDataService() {

  const error = ref<string | null>(null);
  const recipeStore = useRecipeStore();

  const saveNewRecipe = async (recipe: Recipe) => {
    try{
      console.log('trying to save recipe: ', recipe);
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
      recipeStore.deleteTempRecipe(recipe);
    } catch(error) {
      console.log('Saving Recipe error: ', error); 
    }
  };

  const updateUserRecipes = async (recipe: Recipe): Promise<LocalUser | undefined> => {
    try {
      const addUserRecipesResponse = await axios.patch<StandardUserApiResponse>('/user-recipes', {
        id: recipe._id,
        originalUserId: recipe.userId
      },{
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const user = addUserRecipesResponse.data.data;
      if (!user) throw new Error('Updated Data not found, retry, reset FE changes?')
      console.log('recipe:', recipe)
      return user;
    }catch (error) {
      console.log('upset user recipe error: ', error);
    }
  }

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
      recipeStore.deleteTempRecipe(returnedRecipe);
    } catch(error) {
      console.log('Updating Recipe error: ', error);
      
    }
  };

  const saveUserData = async (user: LocalUser) => {
    // const tempUpdateData = user
    // tempUpdateData.recipes = dummyData.recipeState.recipes as any
    error.value = null // Reset error
    try {
      console.log('saving user data: ', user)
      // const res =  await fetch('http://localhost:8080/api/user', {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Authorization: 'Bearer ' + this.props.token,
      //   },
      //   method: 'POST',
      //   body: JSON.stringify({
      //     data: user,
      //   }),
      // })
      // await setDoc(doc(usersRef, user.uid), user)
      
      // if (!res.ok) throw new Error('failed to save user data');
      return ;
      // return;
    } catch (err: any) {
      error.value = err
      console.error('Error saving user data:', error.value)
    }
  }

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

  const savePublicRecipesData = async (publicRecipes: Recipe[]) => {
    console.log('not needed, remove flow fully', publicRecipes)

  }

  const updatePublicRecipesData = async () => {
    console.log('not needed, remove flow fully')
  }

  const deletePublicRecipesData = async (publicRecipes: Recipe[]) => {
    console.log('not needed, remove flow fully', publicRecipes)
    
  }

  return { saveNewRecipe, updateUserRecipes, updateRecipe, saveUserData, getPublicRecipes, savePublicRecipesData, deletePublicRecipesData, updatePublicRecipesData, getUserData, error }
}
