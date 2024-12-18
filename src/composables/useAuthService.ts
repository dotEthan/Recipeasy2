// src/composables/useDataService.ts
import { ref } from 'vue'
import { auth, usersRef } from '../../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, 
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from 'firebase/auth'
import { useDataService } from './useDataService'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { Recipe } from '@/types/Recipes'

export function useAuthService() {
  const error = ref<string | null>(null)
  const isLoading = ref(false) // For displaying user feedback AKA: TODO
  const dataService = useDataService()
  const appStore = useAppStore()
  const userStore = useUserStore()

  const clearError = () => {
    error.value = null
  }

  const initializeAuth = async () => {
    return new Promise((resolve) => {
      userStore.authorized = false
     
    const timeoutId = setTimeout(() => {
      console.error('Auth Initialization Timed Out')
      userStore.authorized = false
      resolve(false)
    }, 7000)  // Increased timeout to 7 seconds
  
      const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
        try {
          clearTimeout(timeoutId)
          if (currentUser) {
            const userId = currentUser?.uid
            const [userStoredData, uid] = await dataService.loadUserData(userId)
            const [publicRecipeStoredData] = await dataService.loadPublicRecipeData(userId)

            const userState = {
              uid: currentUser?.uid,
              authorized: true,
              localUser: {
                ...userStoredData,
                uid
              }
            }
           
            // Explicitly set authorized to true
            userStore.authorized = true
            appStore.initializeApp(userState, publicRecipeStoredData as Recipe[])
            
            resolve(true)
          } else {
            // Explicitly set authorized to false
            userStore.authorized = false
            console.log('No User Found', new Date().toISOString())
            resolve(false)
          }
                   
          // Important: Unsubscribe immediately
          unsubscribe()
        } catch (error) {
          console.error('Auth Initialization Error', error)
          userStore.authorized = false
          unsubscribe()
          resolve(false)
        }
      }, (error) => {
        console.error('Firebase Auth State Change Error', error)
        userStore.authorized = false
        clearTimeout(timeoutId)
        resolve(false)
      })
    })
  }

  // Sign in User
  const signIn = async (email: string, password: string) => {
    try {
      isLoading.value = true
      clearError()

      // Maintain auth
      await setPersistence(auth, browserLocalPersistence)

      // Sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const {user} = userCredential
      localStorage.setItem('recipeasyUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        lastLogin: new Date().toISOString()
      }))

      // Get user data from database
      const [userStoredData, uid] = await dataService.loadUserData(user.uid)
      const [publicRecipeStoredData] = await dataService.loadPublicRecipeData(user.uid)

      const userState = { uid, authorized: true, localUser: {
        uid,
        ...userStoredData
      } }

      console.log('Store Data set:', userState)
      // trigger full app initialization
      appStore.initializeApp(userState, publicRecipeStoredData as Recipe[])

      return
    } catch (err) {
      //TODO error handling
      error.value = err instanceof Error ? err.message : 'Sign in failed'
      throw err
    }
  }

  const registerUser = async (email: string, password: string)=> {
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
      const [publicRecipeStoredData] = await dataService.loadPublicRecipeData(user.uid)
  
      // Initialize stores
      const userState = { 
        localUser: userStoredData, 
        uid: user.uid, 
        authorized: true 
      }
      appStore.initializeApp(userState, publicRecipeStoredData as Recipe[])
      return
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

  return { signIn, registerUser, logOut, initializeAuth }
}
