// src/composables/useDataService.ts
import { AxiosError } from "axios";

import { ref } from "vue";

import axios from "@/axios";
import { useAppStore } from "@/stores/appStore";
import { useRecipeStore } from "@/stores/recipeStore";
import { useShoppingListStore } from "@/stores/shoppingListStore";
import { useToastStore } from "@/stores/toastStore";
import { useUserStore } from "@/stores/userStore";
import type { StandardRecipeApiResponse } from "@/types/ApiResponse.d";
import type { Recipe } from "@/types/Recipes.d";
import type { LocalUser } from "@/types/UserState.d";
import { ToastType } from "@/types/toasts.d";

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
  const toastStore = useToastStore();

  const error = ref<string | null>(null);
  const isLoading = ref(false); // TODO User Feedback

  const clearError = () => {
    error.value = null;
  };

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
  const registerUser = async (displayName: string, email: string, password: string) => {
    try {
      clearError();
      const response = await axios.post("/auth/register", {
        displayName,
        email,
        password
      });

      // Initialize stores
      const userState = {
        localUser: response.data,
        authorized: true
      };
      // const publicRecipeArray = publicRecipeStoredData
      userStore.setInitialUserState(userState);
      return;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error(error.response.data);
        } else {
          console.error("Error", error.message);
        }
      }
    }
  };

  /**
   * Calls API to login user and then set user's data in store
   * @todo if password reset flow initialized?
   * @todo Update with ful App State updates
   * @todo if userResponse.newEmailVerifyCodeCreated created, block login
   * @param {string} email - The user's email
   * @param {string} password - the user's password
   * @returns {Promise<boolean>} - A boolean to show if the user is verified or not
   * @example
   * const authService = useAuthService();
   * const isVerified = await authService.signIn('email@email.com', '1234abcd')
   */
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      clearError();

      const userResponse = await axios.post("/auth/login", { email, password });
      // notify to check email, or resend token if not available
      const localUser = userResponse.data.user as LocalUser;
      const userRecipesData: Recipe[] = userResponse.data.recipeResponse;
      const userState = { authorized: true, localUser };

      const accessToken: string = userResponse.data.accessToken;

      appStore.setAcessToken(accessToken);

      // Store Initializations
      userStore.setInitialUserState(userState);
      recipeStore.setInitialUserRecipeState(userRecipesData);
      shoppingListStore.setInitialListState(userState.localUser.shoppingLists || []);

      const appState = {
        lightMode: userState.localUser.preferences?.lightMode
      };

      appStore.setInitialAppState(appState);
      toastStore.showToast("Login Successful", ToastType.SUCCESS);

      return localUser.verified;
    } catch (err) {
      //TODO error handling
      console.log("signin failed: ", JSON.stringify(err));
      error.value = err instanceof Error ? err.message : "Sign in failed";
      throw err;
    }
  };

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
      await axios.delete("/auth/refresh-token");

      const storedKeys = Object.keys(sessionStorage);

      storedKeys.map((key) => {
        console.log("key:", key);
        if (key !== "publicRecipes") {
          console.log("remove:", key);
          sessionStorage.removeItem(key);
        }
      });
      localStorage.clear();
      recipeStore.resetUserRecipeState();
      appStore.resetAppStates();

      toastStore.showToast("User Logged out", ToastType.SUCCESS);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Logout failed";
      throw err;
    }
  };

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
      const userEmail = userStore.getCurrentUserEmail;
      const response = await axios.post("/admin/verification-codes/verify", {
        code: enteredCode,
        userEmail
      });
      if (!response.data.success) throw new Error("User Verifcation Unsuccessful. Retry?");
      userStore.verifyUser();
    } catch (err) {
      console.log("verify User err: ", err);
    }
  };

  /**
   * Calls API to start user password reset flow
   * @param {string} - email of user asking for reset
   * @returns {Promise<void>} - None
   * @example
   * const authService = useAuthService();
   * await authService.passwordReset('email@email.com');
   */
  const passwordReset = async (email: string) => {
    await axios.post("/admin/password-reset-requests", {
      email
    });
  };

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
    await axios.patch("/admin/user-password", {
      password,
      code: token
    });
  };

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
    const validateRes = await axios.post<StandardRecipeApiResponse>(
      "/admin/password-reset/validate",
      {
        code: token
      }
    );
    const isTokenValid = validateRes.data.success;
    return isTokenValid;
  };

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
