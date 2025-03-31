// src/composables/useDataService.ts
import { ref } from 'vue';
import { AxiosError } from 'axios';
import { useDataService } from './useDataService';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { Recipe } from '@/types/Recipes';
import axios from '@/axios';
import { LocalUser } from '@/types/UserState';

export function useAuthService() {
  const error = ref<string | null>(null)
  const isLoading = ref(false) // TODO User Feedback
  const dataService = useDataService()
  const appStore = useAppStore()
  const userStore = useUserStore()

  const clearError = () => {
    error.value = null
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
      
      const userData: LocalUser = {
        _id: userResponse.data._id,
        verified: userResponse.data.verified        
      }
      // const [userStoredData, uid] = await dataService.loadUserData(user.uid);
      // const publicRecipeStoredData = await dataService.loadPublicRecipeData();
      const publicRecipeStoredData: Array<Recipe> = [];
      const userState = { _id: userData._id, authorized: true, localUser: {
        ...userResponse.data.user
      }};

      // // trigger full app initialization
      appStore.initializeApp(userState, publicRecipeStoredData)

      return;
    } catch (err) {
      //TODO error handling
      console.log('signin failed: ', JSON.stringify(err));
      error.value = err instanceof Error ? err.message : 'Sign in failed';
      throw err;
    }
  }
  // TODO Implement logout with passport
  const logOut = async () => {
    try {
      clearError();
      const response = await axios.post('/logout', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('logged out: ', response);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Logout failed';
      throw err;
    }
  }

  const verifyUser = async (enteredCode: string) => {
    try {
      await axios.post('/verification-code', {
        code: enteredCode
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      userStore.verifyUser();
    } catch(err) {
      console.log('verify User err: ', err);
    }

  }

  return {
    signIn,
    registerUser,
    logOut,
    verifyUser
  };
}


/// TODO SIGN IN AND LOGOUT AS AXIOS. SEE ABOUT SESSIONS an dwhy the cookie isn't working. Maybe switch to 0Auth? 