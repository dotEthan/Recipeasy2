import { ref } from 'vue'
import {
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  setDoc
} from 'firebase/firestore'
import type { LocalUser } from '@/types/UserState'
import { publicRecipesRef, usersRef } from '../../firebase'
import { Recipe } from '@/types/Recipes'
import { useRecipeStore } from '@/stores/recipe'
import { useUserStore } from '@/stores/user'
import { getAuth } from 'firebase/auth'

export function useDataService() {

  const error = ref<string | null>(null)
  const recipeStore = useRecipeStore()

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

  const updatePublicRecipesData = async () => {
    const newPublicRecipes = recipeStore.newPublicRecipes
    const toBeDeletedPublicRecipes = recipeStore.removedPublicRecipes
    if(newPublicRecipes.length > 0) savePublicRecipesData(newPublicRecipes)
    if (toBeDeletedPublicRecipes.length > 0) deletePublicRecipesData(toBeDeletedPublicRecipes)
  }

  const savePublicRecipesData = async (publicRecipes: Recipe[]) => {
    error.value = null // Reset error
    const userStore = useUserStore()
    try {
      console.log('Saving public recipe data: ', publicRecipes)
      for (const recipe of publicRecipes) {
        const prefixedRecipeId = `pub-${recipe.id}`
        const userId = userStore.getCurrentUserId
        const updatedRecipe =  {...recipe, id: prefixedRecipeId, creatorId: userId}
        console.log('updatedRecipe: ', updatedRecipe)
        console.log('current User Id: ', userStore.getCurrentUserId)
        // Check if recipe id exists
        const existingRecipeDocRef = doc(publicRecipesRef, prefixedRecipeId);
        const docSnap = await getDoc(existingRecipeDocRef);
          console.log('check for existing recipe')
        if (docSnap.exists()) {
          // TODO if recipe exists, display error
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

  const deletePublicRecipesData = async (publicRecipes: Recipe[]) => {
    error.value = null 
    try {
      for (const recipe of publicRecipes) {   
        // check it existss
        console.log('auth: ', getAuth())
        const recipeRef = doc(publicRecipesRef, `pub-${recipe.id}`)
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

  return { saveUserData, loadUserData, loadPublicRecipeData, savePublicRecipesData, deletePublicRecipesData, updatePublicRecipesData, error }
}
