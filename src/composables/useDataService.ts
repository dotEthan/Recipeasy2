import { ref } from 'vue'
import { collection, doc, getDoc, setDoc, getFirestore } from 'firebase/firestore'
import type { LocalUser } from '@/types/UserState'

export function useDataService() {
  const db = getFirestore()

  const error = ref<string | null>(null)

  const saveUserData = async (user: LocalUser) => {
    error.value = null // Reset error
    try {
      const usersRef = collection(db, 'users')
      await setDoc(doc(usersRef, user.uid), user)
      console.log('User data saved successfully')
    } catch (err: any) {
      error.value = err
      console.error('Error saving user data:', error.value)
    }
  }

  const loadUserData = async (uid: string) => {
    error.value = null
    try {
      const usersRef = collection(db, 'users')
      const docSnap = await getDoc(doc(usersRef, uid))

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
