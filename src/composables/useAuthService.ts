// src/composables/useDataService.ts
import { ref } from 'vue';
import { AxiosError } from 'axios';
import { useDataService } from './useDataService';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { Recipe } from '@/types/Recipes';
import axios from '@/axios';
import { LocalUser, UserState } from '@/types/UserState';

export function useAuthService() {
  const error = ref<string | null>(null)
  const isLoading = ref(false) // TODO User Feedback
  const dataService = useDataService()
  const appStore = useAppStore()
  const userStore = useUserStore()

  const clearError = () => {
    error.value = null
  }

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
          authorized: true 
        }
        // const publicRecipeArray = publicRecipeStoredData 
        appStore.setAuthorizedUserData(userState, []);
        
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

  const signIn = async (email: string, password: string): Promise<boolean> => {
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
      console.log('signed in: ', userResponse);
    
      const localUser = userResponse.data.user as LocalUser;
      const userRecipesData: Recipe[] = userResponse.data.recipeResponse;
      const userState = { _id: localUser._id, authorized: true, localUser: {
        ...userResponse.data.user
      }};
      console.log('trigger App Store Initialization, data: ', userRecipesData)

      appStore.setAuthorizedUserData(userState, userRecipesData)

      return localUser.verified;
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

  const passwordReset = async (email: string) => {
    console.log('password reset api call')
    await axios.post('/reset-password', {
      email
    },
    {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  
  const setNewPassword = async (password: string, token: string) => {
    console.log('set new Password api call')
    await axios.post('/update-password', {
      password,
      code: token
    },
    {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  const validatePasswordToken = async (token: String) => {
    console.log('validate password token: ', token);
    await axios.post('/validate-password-token', {
      code: token
    },
    {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }


  return {
    signIn,
    registerUser,
    logOut,
    verifyUser,
    passwordReset,
    setNewPassword,
    validatePasswordToken
  };
}
