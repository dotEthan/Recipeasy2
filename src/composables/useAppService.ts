import { onMounted, onUnmounted, ref } from "vue";

import axios from "@/axios";
import { useDataService } from "@/composables/useDataService";
import router from "@/router/main";
import { useAppStore } from "@/stores/appStore";
import { useRecipeStore } from "@/stores/recipeStore";
import { useShoppingListStore } from "@/stores/shoppingListStore";
import { useUserStore } from "@/stores/userStore";
import { ScreenSize } from "@/types/AppState.d";
import { checkIfCacheExpired, debounce } from "@/utilities";

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
  const screenWidth = ref(window.innerWidth);

  /**
   * Updates the screensize variable in the appStore for business rules
   * @todo Refactor for app's new structure if needed
   * @param {} - None
   * @returns {Promise<void>} - The dark void.
   * @example
   * const { updatescreenSize } = useAppService();
   * updatescreenSize();
   */

  const updatescreenSize = () => {
    const width = screenWidth.value;
    let screenSize: ScreenSize;
    if (width < 640) {
      screenSize = ScreenSize.SMALL;
    } else if (width < 1024) {
      screenSize = ScreenSize.MEDIUM;
    } else {
      screenSize = ScreenSize.LARGE;
    }
    appStore.setScreenSize(screenSize);
  };
  // TODO longer debounce?
  const onResize = debounce(() => {
    screenWidth.value = window.innerWidth;
    updatescreenSize();
  }, 10);

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

  // TODO check if still needed or better route
  onMounted(() => window.addEventListener("resize", onResize));
  onUnmounted(() => window.removeEventListener("resize", onResize));

  const initializeApp = async () => {
    let isAutheticated = false;

    try {
      await refreshToken();
      isAutheticated = true;

      let cachedLocalUser = checkIfCacheExpired("localUser");
      let cachedUserRecipes = checkIfCacheExpired("userRecipes");
      let cachedAllTags = checkIfCacheExpired("allTags");
      const cachedRecipeCollections = checkIfCacheExpired("recipeCollections");
      const cachedSelectedRecipeId = sessionStorage.getItem("selectedRecipeId") ?? undefined;
      const cachedEditSelectedRecipe =
        sessionStorage.getItem("editSelectedRecipe") === "true" || false;
      const cachedShoppingLists = checkIfCacheExpired("shoppingLists");
      if (
        isAutheticated &&
        (!cachedUserRecipes ||
          !cachedLocalUser ||
          !cachedAllTags ||
          !cachedShoppingLists ||
          !cachedRecipeCollections)
      ) {
        console.log("old data, refresh: ");
        // TODO No userId in here
        const userResponse = await dataService.getCurrentUserData();
        recipeStore.fetchRecipeCollections();
        if (!userResponse) throw new Error("no response");
        const { userData, userRecipes } = userResponse;
        cachedLocalUser = userData;
        cachedUserRecipes = userRecipes;
        // TODO add when implementing tags
        cachedAllTags = [];
      }

      recipeStore.hydrateStore({
        recipes: cachedUserRecipes,
        allTags: cachedAllTags,
        recipeCollections: cachedRecipeCollections,
        selectedRecipeId: cachedSelectedRecipeId,
        editSelectedRecipe: cachedEditSelectedRecipe
      });

      userStore.setInitialUserState({ localUser: cachedLocalUser, authorized: true });
      shoppingListStore.hydrateStore(cachedShoppingLists);
    } catch (error) {
      console.log("token refresh failed");
      await recipeStore.fetchRecipeCollections();
      appStore.resetAppStates();
      router.push("/");
    }

    console.log("Stores hydrated");
  };

  const refreshToken = async () => {
    try {
      const refreshTokenResponse = await axios.post("/admin/refresh-token");
      appStore.setAcessToken(refreshTokenResponse.data.accessToken);
    } catch (error) {
      console.log("token refresh failiure: ", error);
      throw new Error("Token Refresh Failed, relogin");
    }
  };

  return {
    onResize,
    handleUnsavedChanges,
    initializeApp,
    refreshToken
  };
}
