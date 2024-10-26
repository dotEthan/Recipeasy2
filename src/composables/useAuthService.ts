// src/composables/useDataService.ts
import { ref } from 'vue'
import { auth } from '../firebase'
import type { User } from 'firebase/auth'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'

export function useAuthService() {
  const error = ref<string | null>(null)

  const signIn = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  }

  const registerUser = async (email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  }

  const logOut = async () => {
    await signOut(auth)
  }

  return { signIn, registerUser, logOut }
}
