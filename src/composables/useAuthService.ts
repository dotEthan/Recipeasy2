// src/composables/useDataService.ts
import { ref } from 'vue';
import { AxiosError } from 'axios';
import { useDataService } from './useDataService';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { Recipe } from '@/types/Recipes';
import axios from '@/axios';
import { UserState } from '@/types/UserState';

export function useAuthService() {
  const error = ref<string | null>(null)
  const isLoading = ref(false) // TODO User Feedback
  const dataService = useDataService()
  const appStore = useAppStore()
  const userStore = useUserStore()

  const clearError = () => {
    error.value = null
  }

  const initializeAuth = async () => {
    // return new Promise((resolve) => {
    //   userStore.authorized = false
     
    //   const timeoutId = setTimeout(() => {
    //     console.error('Auth Initialization Timed Out')
    //     userStore.authorized = false
    //     resolve(false)
    //   }, 7000)
  
    //   const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
    //     try {
    //       clearTimeout(timeoutId)
    //       if (currentUser) {
    //         const userId = currentUser?.uid
    //         const [userStoredData, uid] = await dataService.loadUserData(userId)
    //         const publicRecipeStoredData = await dataService.loadPublicRecipeData()

    //         const userState = {
    //           _id: currentUser?.uid,
    //           authorized: true,
    //           localUser: {
    //             _id: 'FIXME'
    //             // ...userStoredData
    //           }
    //         }

    //         userStore.authorized = true
    //         appStore.initializeApp(userState, publicRecipeStoredData)
            
    //         resolve(true)
    //       } else {
    //         userStore.authorized = false
    //         console.log('No User Found', new Date().toISOString())
    //         resolve(false)
    //       }
                   
    //       // Important: Unsubscribe immediately
    //       unsubscribe()
    //     } catch (error) {
    //       console.error('Auth Initialization Error', error)
    //       userStore.authorized = false
    //       unsubscribe()
    //       resolve(false)
    //     }
    //   }, (error) => {
    //     console.error('Firebase Auth State Change Error', error)
    //     userStore.authorized = false
    //     clearTimeout(timeoutId)
    //     resolve(false)
    //   })
    // })
  }

  // TODO - Auto Login after register? Email verification? 
  const registerUser = async (displayName: string, email: string, password: string)=> {
    try {
        clearError()
        const response = await axios.post('/register', {
          displayName,
          email,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        });
      
        console.log('Registered user: ', response.data);
  
        // Initialize stores
        const userState = { 
          localUser: response.data, 
          _id: response.data._id, 
          authorized: true 
        }
        const publicRecipeArray: [] = [];
        // const publicRecipeArray = publicRecipeStoredData 
        appStore.initializeApp(userState, publicRecipeArray)
        return;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response) {
            console.error(error.response.data);
          } else if (error.request) {
            console.error('No response received');
          } else {
            console.error('Error', error.message);
          }
        }
      }
  }

  const signIn = async (email: string, password: string) => {
    try {
      clearError()

      const userResponse = await axios.post('/login', {
        email,
        password
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const userData = userResponse.data;
      // const [userStoredData, uid] = await dataService.loadUserData(user.uid);
      // const publicRecipeStoredData = await dataService.loadPublicRecipeData();
      const publicRecipeStoredData: Array<Recipe> = [];
      const userState = { _id: userData._id, authorized: true, localUser: {
        ...userData.data
      }};

      // // trigger full app initialization
      appStore.initializeApp(userState, publicRecipeStoredData)

      return;
    } catch (err) {
      //TODO error handling
      console.log('signin failed: ', JSON.stringify(err))
      error.value = err instanceof Error ? err.message : 'Sign in failed'
      throw err
    }
  }
  // TODO Implement logout with passport
  const logOut = async () => {
    try {
      clearError()
      const response = await axios.post('/logout', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('logged out: ', response);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Logout failed'
      throw err
    }
  }

  return { signIn, registerUser, logOut, initializeAuth }
}


/// TODO SIGN IN AND LOGOUT AS AXIOS. SEE ABOUT SESSIONS an dwhy the cookie isn't working. Maybe switch to 0Auth? 