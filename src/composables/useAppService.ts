import { onMounted, onUnmounted, ref } from "vue";

import axios from "@/axios";
import { useDataService } from "@/composables/useDataService";
import { CriticalError } from "@/errors";
import router from "@/router/main";
import { useAppStore } from "@/stores/appStore";
import { useRecipeStore } from "@/stores/recipeStore";
import { useShoppingListStore } from "@/stores/shoppingListStore";
import { useUserStore } from "@/stores/userStore";
import { debounce, loadCachedData } from "@/utilities";

import { useRecipeService } from "./useRecipeService";

/**
 * Handles all methods to help bootstrap the App: screen size tracking.
 * @returns {Object} - onResize, handleUnsavedChanges, checkSession, hydrateStores
 */

export function useAppService() {
  const appStore = useAppStore();
  const userStore = useUserStore();
  const recipeStore = useRecipeStore();
  const shoppingListStore = useShoppingListStore();
  const dataService = useDataService();
  const recipeService = useRecipeService();

  /**
   * Was Temporarily used to ensure users can't leave without saving.
   * @todo Remove once pesistence and immediate saving reworked
   * @param {e} - Event object
   * @returns {Promise<void>} - The dark void.
   * @example
   * const { handleUnsavedChanges } = useAppService();
   * handleUnsavedChanges();
   */

  const handleUnsavedChanges = (e: BeforeUnloadEvent) => {
    const appStore = useAppStore();
    if (appStore.appHasUnsavedChanges) {
      appStore.showUnsavedChangesModal = true;
      e.preventDefault();
    }
  };

  // // TODO if resize is working, not needed
  // onMounted(() => window.addEventListener("resize", onResize));
  // onUnmounted(() => window.removeEventListener("resize", onResize));

  /**
   * Initial flow to start app. Check server, check caches and hydrate stores, or make calls to refresh data
   * @todo Loading Component
   * @todo Dummy Data and offline: true; if server down
   * @param {e} - Event object
   * @returns {Promise<void>} - The dark void.
   * @example
   * const { handleUnsavedChanges } = useAppService();
   * handleUnsavedChanges();
   */
  const initializeApp = async () => {
    let isAutheticated = false;

    try {
      const serverUp = await serverHealthCheck();
      if (!serverUp) {
        throw new CriticalError("Backend Server not responding");
      }

      const tokenSet = await refreshToken();
      if (!tokenSet) {
        console.log("token refresh failed: ");
        appStore.resetAppStates();

        const recipeCollections = await recipeService.fetchRecipeCollections();
        recipeStore.setRecipeCollections(recipeCollections);
        router.push("/");
      } else {
        // TODO DO I need isAutheticated now?
        isAutheticated = true;
        const cachedData = loadCachedData();
        if (
          isAutheticated &&
          (!cachedData.userRecipes ||
            !cachedData.localUser ||
            !cachedData.allTags ||
            !cachedData.shoppingLists ||
            !cachedData.recipeCollections)
        ) {
          console.log("old data, refresh: ");
          cachedData.recipeCollections = await recipeService.fetchRecipeCollections();
          const userResponse = await dataService.getCurrentUserData();
          // TODO what happens in this flow?
          if (!userResponse) throw new Error("No User Data Found.");
          const { userData, userRecipes } = userResponse;
          cachedData.localUser = userData;
          cachedData.shoppingLists = userData.shoppingLists;
          cachedData.userRecipes = userRecipes;
          // TODO add when implementing tags
          cachedData.allTags = [];
        }

        recipeStore.hydrateStore({
          recipes: cachedData.userRecipes,
          allTags: cachedData.allTags,
          recipeCollections: cachedData.recipeCollections,
          selectedRecipeId: cachedData.selectedRecipeId,
          editSelectedRecipe: cachedData.editSelectedRecipe
        });

        userStore.setInitialUserState({ localUser: cachedData.localUser, authorized: true });
        shoppingListStore.hydrateStore(cachedData.shoppingLists);
      }
    } catch (error) {
      // Handle Error here? or whwat pattern to deal with this?

      console.log("FAILURE");
      if (error instanceof CriticalError) {
        throw error;
      }
      throw new CriticalError("App Initilization Critical Failure, reload page");
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshTokenResponse = await axios.post("/admin/refresh-token");
      appStore.setAcessToken(refreshTokenResponse.data.accessToken);
      return true;
    } catch (error) {
      console.log("token refresh failiure: ", error);
      return false;
    }
  };

  const serverHealthCheck = async () => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/health`;
    console.log("url: ", url);
    try {
      await fetch(url);
      console.log("Server Up");
      return true;
    } catch {
      console.log("Server Down");
      return false;
    }
  };

  return {
    // onResize,
    handleUnsavedChanges,
    initializeApp,
    refreshToken,
    serverHealthCheck
  };
}
