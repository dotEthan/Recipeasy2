// src/composables/useDataService.ts
import { ref } from 'vue'
import { auth, usersRef } from '../../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth' 

export function useAuthService() {
  const error = ref<string | null>(null)

  const clearError = () => {
    error.value = null
  }

  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      clearError()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("signed in")
      return userCredential.user
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Sign in failed'
      throw err
    }
  }

  const registerUser = async (email: string, password: string): Promise<RegisterResult> => {
    try {
      clearError()
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
  
      // Prep data for Firestore
      const userStoredData = {
        uid: user.uid,
        email: user.email ?? undefined,
        displayName: '',
        createdAt: new Date(),
        recipes: [],
        shoppingLists: []
      }
  
      // Save user data to Firestore
      await setDoc(doc(usersRef, user.uid), userStoredData)
  
      // Return the full user data
      return {
        user,
        userData: userStoredData
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      throw err
    }
  }

  const logOut = async () => {
    try {
      clearError()
      await signOut(auth)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Logout failed'
      throw err
    }
  }

  return { signIn, registerUser, logOut }
}
