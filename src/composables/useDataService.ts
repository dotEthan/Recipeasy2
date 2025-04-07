import { ref } from 'vue';
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import type { LocalUser } from '@/types/UserState';
import { publicRecipesRef } from '../../firebase';
import { Recipe } from '@/types/Recipes';
import { useRecipeStore } from '@/stores/recipe';
import { useUserStore } from '@/stores/user';
import { getAuth } from 'firebase/auth';
import axios from '@/axios';;
import { setRecipeStructure } from '@/utilities';
import { ObjectId } from 'bson';

export function useDataService() {

  const error = ref<string | null>(null);
  const recipeStore = useRecipeStore();
  const userStore = useUserStore();

  const saveNewRecipes = async () => {
    try{
      const responseData = await fetch('/userStatepart2.json');
      const data = await responseData.json();
      console.log(data);
      const recipes = data.recipes;
      const userId = userStore.getCurrentUserId;

      const alteredRecipes = setRecipeStructure(recipes, new ObjectId(userId));
      console.log('altered recipes: ', alteredRecipes);
      

      const saveNewResponse = axios.post('/new-recipes', {
        recipes: alteredRecipes
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('saved response: ', saveNewResponse)
    } catch(error) {
      console.log('altering error: ', error)
    }

  };

  // const loadUserData = async (_id: string): Promise<[DocumentData | null, string]> => {
  const loadUserData = async (_id: string): Promise<[null, string]> => {
    // error.value = null
    try {
    return [null, ''];
    } catch (err: any) {
      error.value = err
      console.error('Error loading user data:', error.value)
      return [null, _id]
    }
  };
  
  // const loadUserData = async (uid: string): Promise<[DocumentData | null, string]> => {
  //   error.value = null
  //   try {
  //     const res = await fetch('http://localhost:8080/user')
  //     if (!res.ok) throw new Error('failed to fetch user data');
      
  //     const data = res.json();
  //     console.log('data: ', data)
  //     return [data, uid];
  //   } catch (err: any) {
  //     error.value = err
  //     console.error('Error loading user data:', error.value)
  //     return [null, uid]
  //   }
  // };

  const saveUserData = async (user: LocalUser) => {
    // const tempUpdateData = user
    // tempUpdateData.recipes = dummyData.recipeState.recipes as any
    error.value = null // Reset error
    try {
      console.log('saving user data: ', user)
      const res =  await fetch('http://localhost:8080/api/user', {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: 'Bearer ' + this.props.token,
        },
        method: 'POST',
        body: JSON.stringify({
          data: user,
        }),
      })
      // await setDoc(doc(usersRef, user.uid), user)
      
      if (!res.ok) throw new Error('failed to save user data');
      return res;
      // return;
    } catch (err: any) {
      error.value = err
      console.error('Error saving user data:', error.value)
    }
  }

  const initialLoadPublicRecipeData = async (): Promise<void> => {
    console.log('loading public recipes');
    error.value = null;
    try {
      const publicRecipeResponse = await axios.get('/public-recipes',
        {
          headers: {
            'Content-Type': 'application/json',
          }
        });
      console.log(publicRecipeResponse);
      recipeStore.setInitialPublicRecipeState(publicRecipeResponse.data);
    } catch (err: any) {
      error.value = err
      console.error('Error loading Public Recipe data:', error.value)
    }
  };

  const savePublicRecipesData = async (publicRecipes: Recipe[]) => {
    error.value = null // Reset error
    const userStore = useUserStore()
    try {
      console.log('Saving public recipe data: ', publicRecipes)
      for (const recipe of publicRecipes) {
        const prefixedRecipeId = `pub-${recipe._id}`
        const userId = userStore.getCurrentUserId
        const updatedRecipe =  {...recipe, id: prefixedRecipeId, creatorId: userId}
        console.log('updatedRecipe: ', updatedRecipe)
        console.log('current User Id: ', userStore.getCurrentUserId)
        // Check if recipe id exists
        const existingRecipeDocRef = doc(publicRecipesRef, prefixedRecipeId);
        const docSnap = await getDoc(existingRecipeDocRef);
          console.log('check for existing recipe')
        if (docSnap.exists()) {
          // TODO if recipe exists, display error modal
          console.log('Public Recipe Already Exists')
        } else {
          await setDoc(existingRecipeDocRef, updatedRecipe);
        }
      }
      recipeStore.resetNewPublicRecipes()
    } catch (err: any) {
      error.value = err
      console.error('Error saving public Recipe data:', error.value)
    }
  }

  const updatePublicRecipesData = async () => {
    const newPublicRecipes = recipeStore.newPublicRecipes
    const toBeDeletedPublicRecipes = recipeStore.removedPublicRecipes
    if(newPublicRecipes.length > 0) savePublicRecipesData(newPublicRecipes)
    if (toBeDeletedPublicRecipes.length > 0) deletePublicRecipesData(toBeDeletedPublicRecipes)
  }

  const deletePublicRecipesData = async (publicRecipes: Recipe[]) => {
    error.value = null 
    try {
      for (const recipe of publicRecipes) {   
        // check it existss
        console.log('auth: ', getAuth())
        const recipeRef = doc(publicRecipesRef, `pub-${recipe._id}`)
        const recipeSnapshot = await getDoc(recipeRef);

        if (recipeSnapshot.exists()) {
          console.log('recipe exists in db')
          await deleteDoc(recipeRef)
        } else {
          console.log('Recipes not there')
        }
  
      }
      recipeStore.resetRemovedPublicRecipes()
    } catch (err: any) {
      error.value = err
      console.error('Error deleting public Recipe data:', error.value)
    }
    
  }

  return { saveNewRecipes, saveUserData, loadUserData, initialLoadPublicRecipeData, savePublicRecipesData, deletePublicRecipesData, updatePublicRecipesData, error }
}
