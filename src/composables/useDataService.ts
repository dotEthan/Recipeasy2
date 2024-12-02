import { ref } from 'vue'
import {
  doc,
  DocumentData,
  getDoc,
  setDoc
} from 'firebase/firestore'
import type { LocalUser } from '@/types/UserState'
import dummyData from '../assets/dummyData.json'
import { usersRef } from '../../firebase'

export function useDataService() {

  const error = ref<string | null>(null)

  const saveUserData = async (user: LocalUser) => {
    console.log('localUser data: ', user)
    // const tempUpdateData = user
    // tempUpdateData.recipes = dummyData.recipeState.recipes as any
    error.value = null // Reset error
    try {
      console.log('saving data: ', user)
      await setDoc(doc(usersRef, user.uid), user)
      console.log('User data saved successfully')
    } catch (err: any) {
      error.value = err
      console.error('Error saving user data:', error.value)
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

  return { saveUserData, loadUserData, error }
}
