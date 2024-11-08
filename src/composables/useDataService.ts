import { ref } from 'vue'
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getFirestore,
  CollectionReference
} from 'firebase/firestore'
import type { LocalUser } from '@/types/UserState'

export function useDataService() {
  const db = getFirestore()

  const error = ref<string | null>(null)

  const saveUserData = async (user: LocalUser) => {
    console.log('localUser data: ', user)
    error.value = null // Reset error
    try {
      const usersRef = collection(db, 'users')
      console.log('saving data: ', user)
      await setDoc(doc(usersRef, user.uid), user)
      console.log('User data saved successfully')
    } catch (err: any) {
      error.value = err
      console.error('Error saving user data:', error.value)
    }
  }

  const loadUserData = async (uid: string, collectionReference: CollectionReference) => {
    error.value = null
    try {
      const docSnap = await getDoc(doc(collectionReference, uid))

      if (docSnap.exists()) {
        console.log('User data retrieved:', docSnap.data())
        return docSnap.data()
      } else {
        console.log('No such document!')
        return null
      }
    } catch (err: any) {
      error.value = err
      console.error('Error loading user data:', error.value)
      return null
    }
  }

  return { saveUserData, loadUserData, error }
}
