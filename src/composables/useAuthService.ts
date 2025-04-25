// src/composables/useDataService.ts
import { ref } from 'vue';
import { AxiosError } from 'axios';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { Recipe } from '@/types/Recipes';
import axios from '@/axios';
import { LocalUser } from '@/types/UserState';
import { StandardRecipeApiResponse } from '@/types/ApiResponse';
import { useRecipeStore } from '@/stores/recipe';
import { useShoppingListStore } from '@/stores/shoppingList';
import { clearSessionData, setSessionData } from '@/utilities';

/**
 * Handles Authorization related API calls and initilizations
 * @returns - signIn, registerUser, logOut, verifyUser, passwordReset, setNewPassword, validatePasswordToken
 * @example
 * const authService = useAuthService();
 * const authRes = await authService.registerUser('name', 'email@email.com', '1234abcd')
 */

export function useAuthService() {
  const appStore = useAppStore();
  const userStore = useUserStore();
  const recipeStore = useRecipeStore();
  const shoppingListStore = useShoppingListStore();

  const error = ref<string | null>(null)
  const isLoading = ref(false) // TODO User Feedback

  const clearError = () => {
    error.value = null
  }

  /**
   * Calls API to register user and then set user's data in store
   * @param {string} displayName - The user's chosen display name
   * @param {string} email - The user's email
   * @param {string} password - the user's password
   * @returns {Promise<void>} 
   * @example
   * const authService = useAuthService();
   * await authService.registerUser('name', 'email@email.com', '1234abcd')
   */
  const registerUser = async (displayName: string, email: string, password: string)=> {
    try {
        clearError()
        const response = await axios.post('/auth/register', {
          displayName,
          email,
          password
        });
  
        // Initialize stores
        const userState = { 
          localUser: response.data, 
          authorized: true 
        }
        // const publicRecipeArray = publicRecipeStoredData 
        userStore.setInitialUserState(userState);
        userStore.cacheUserState();
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

  /**
   * Calls API to login user and then set user's data in store
   * @todo if password reset flow initialized?
   * @param {string} email - The user's email
   * @param {string} password - the user's password
   * @returns {Promise<boolean>} - A boolean to show if the user is verified or not
   * @example
   * const authService = useAuthService();
   * const isVerified = await authService.signIn('email@email.com', '1234abcd')
   */
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      clearError()

      const userResponse = await axios.post('/auth/login', { email, password });
      console.log('signed in: ', userResponse);
    
      const localUser = userResponse.data.user as LocalUser;
      const userRecipesData: Recipe[] = userResponse.data.recipeResponse;
      const userState = { authorized: true, localUser: {
        ...userResponse.data.user
      }};
      console.log('trigger App Store Initialization, data: ', userRecipesData)

      // Store Initializations
      userStore.setInitialUserState(userState);
      recipeStore.setInitialUserRecipeState(userRecipesData);
      shoppingListStore.setInitialListState(userState.localUser.shoppingLists || []);
      // TODO Update with ful App State updates
      const appState = { 
        lightMode: userState.localUser.preferences.lightMode
      };
      // TODO wasnt working, check
      appStore.setInitialAppState(appState);
      console.log('caching')
      userStore.cacheUserState();
      recipeStore.cacheRecipeState();
      console.log('finished all')
      shoppingListStore.cacheListState();
      console.log('finished all')
      appStore.cacheAppState();
      console.log('finished all')

      return localUser.verified;
    } catch (err) {
      //TODO error handling
      console.log('signin failed: ', JSON.stringify(err));
      error.value = err instanceof Error ? err.message : 'Sign in failed';
      throw err;
    }
  }
  
  /**
   * Calls API to logout user from the backend
   * @param {void} - None
   * @returns {Promise<void>} - None
   * @example
   * const authService = useAuthService();
   * await authService.logOut();
   */
  const logOut = async () => {
    try {
      clearError();
      const response = await axios.delete('/auth/session');

      // Clear cached data
      clearSessionData('userData');
      clearSessionData('appState');
      clearSessionData('shoppingLists');
      recipeStore.resetUserRecipeState();
      recipeStore.cacheRecipeState();
      console.log('logged out: ', response);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Logout failed';
      throw err;
    }
  }

  /**
   * Calls API to verify user based on code emailed to them and set user.verified if correct
   * @param {string} - code emailed to user
   * @returns {Promise<void>} - None
   * @example
   * const authService = useAuthService();
   * await authService.verifyUser('1234abcd');
   */
  const verifyUser = async (enteredCode: string) => {
    try {
      const response = await axios.post('/admin/verification-codes/verify', {
        code: enteredCode
      });
      if (!response.data.success) throw new Error('User Verifcation Unsuccessful. Retry?');
      userStore.verifyUser();
      userStore.cacheUserState();
    } catch(err) {
      console.log('verify User err: ', err);
    }
  }

  /**
   * Calls API to start user password reset flow
   * @param {string} - email of user asking for reset
   * @returns {Promise<void>} - None
   * @example
   * const authService = useAuthService();
   * await authService.passwordReset('email@email.com');
   */
  const passwordReset = async (email: string) => {
    console.log('password reset api call')
    await axios.post('/admin/password-reset-requests', {
      email
    });
  }

  /**
   * Calls API to finish User password reset flow and reset users password
   * @todo token in body or in url?
   * @param {string} - new password
   * @param {string} - password reset token
   * @returns {Promise<void>} - None
   * @example
   * const authService = useAuthService();
   * await authService.setNewPassword('newpassword1234!', '1234abcd');
   */  
  const setNewPassword = async (password: string, token: string) => {
    console.log('set new Password api call')
    await axios.patch('/admin/user-password', {
      password,
      code: token
    });
  }

  /**
   * Calls API to check if the password reset token is valid
   * @todo token in body or in url?
   * @param {string} - password reset token
   * @returns {boolean} - boolean to say if token is still valid
   * @example
   * const authService = useAuthService();
   * await authService.v('1234abcd');
   */  
  const validatePasswordToken = async (token: String) => {
    console.log('validate password token: ', token);
    const validateRes = await axios.post<StandardRecipeApiResponse>('/admin/password-reset/validate', {
      code: token
    });
    const isTokenValid = validateRes.data.success;
    return isTokenValid
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
