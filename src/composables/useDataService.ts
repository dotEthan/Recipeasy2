import { ref } from 'vue'
import {
  doc,
  DocumentData,
  getDoc,
  setDoc
} from 'firebase/firestore'
import type { LocalUser } from '@/types/UserState'
import dummyData from '../assets/dummyData.json'
import { publicRecipesRef, usersRef } from '../../firebase'
import { Recipe } from '@/types/Recipes'

export function useDataService() {

  const error = ref<string | null>(null)

  const saveUserData = async (user: LocalUser) => {
    // const tempUpdateData = user
    // tempUpdateData.recipes = dummyData.recipeState.recipes as any
    error.value = null // Reset error
    try {
      console.log('saving user data: ', user)
      await setDoc(doc(usersRef, user.uid), user)
      console.log('User data saved successfully')
    } catch (err: any) {
      error.value = err
      console.error('Error saving user data:', error.value)
    }
  }

  const savePublicRecipesData = async (publicRecipes: Recipe[]) => {
    error.value = null // Reset error
    try {
      console.log('Saving public recipe data: ', publicRecipes)
  
      for (const recipe of publicRecipes) {
        // Check if recipe id exists
        const existingRecipeDocRef = doc(publicRecipesRef, `pub-${recipe.id}`);
        const existingRecipe = await getDoc(existingRecipeDocRef);
        const publicRecipeId = !existingRecipe ? `pub-${recipe.id}` : `pub-${recipe.id}-z`
        const updatedRecipe = {...recipe, id: publicRecipeId}

        await setDoc(existingRecipeDocRef, updatedRecipe);
      }
    } catch (err: any) {
      error.value = err
      console.error('Error saving public Recipe data:', error.value)
    }
  }

  
const loadUserData = async (uid: string): Promise<[DocumentData | null, string]> => {
  error.value = null;
  try {
    const docSnap = await getDoc(doc(usersRef, uid));

    if (docSnap.exists()) {
      console.log('User data retrieved:', docSnap.data());
      return [docSnap.data(), uid];
    } else {
      console.log('User Data Not Found');
      return [null, uid];
    }
  } catch (err: any) {
    error.value = err;
    console.error('Error loading user data:', error.value);
    return [null, uid];
  }
};

const loadPublicRecipeData = async (uid: string): Promise<[DocumentData | null]> => {
  error.value = null;
  try {
    const docSnap = await getDoc(doc(publicRecipesRef, uid));

    if (docSnap.exists()) {
      console.log('Public Recipe data retrieved:', docSnap.data());
      return [docSnap.data()];
    } else {
      console.log('Public Recipe Data Not Found');
      return [null];
    }
  } catch (err: any) {
    error.value = err;
    console.error('Error loading Public Recipe data:', error.value);
    return [null];
  }
};

  return { saveUserData, loadUserData, loadPublicRecipeData, savePublicRecipesData, error }
}
