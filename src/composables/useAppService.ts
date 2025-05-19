import { ref, onMounted, onUnmounted } from 'vue'
import axios from '@/axios';
import { useAppStore } from '@/stores/appStore'
import { checkIfCacheExpired, debounce, getSessionData } from '@/utilities';
import { StandardUserApiResponse } from '@/types/ApiResponse';
import type { ScreenSize } from '@/types/ScreenSize'
import router from '@/router/main';
import { useAuthService } from './useAuthService';
import { CachedUserState } from '@/types/UserState';
import { CachedRecipeState } from '@/types/Recipes';
import { CachedShoppingListState } from '@/types/ShoppingLists';
import { useDataService } from './useDataService';
import { useUserStore } from '@/stores/userStore';
import { useRecipeStore } from '@/stores/recipeStore';
import { useShoppingListStore } from '@/stores/shoppingListStore';

/**
 * Handles all methods to help bootstrap the App: screen size tracking.
 * @returns {Object} - onResize, handleUnsavedChanges, checkSession, hydrateStores
 */

export function useAppService() {
  const appStore = useAppStore();
  const userStore = useUserStore();
  const recipeStore = useRecipeStore();
  const shoppingListStore = useShoppingListStore();
  const authService = useAuthService();
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
    const width = screenWidth.value
    let screenSize: ScreenSize
    console.log('screensizze')
    if (width < 640) {
      screenSize = 'sm'
    } else if (width < 1024) {
      screenSize = 'md'
    } else {
      screenSize = 'lg'
    }
    appStore.setScreenSize(screenSize)
  }
  // TODO longer debounce? 
  const onResize = debounce(() => {
    screenWidth.value = window.innerWidth
    updatescreenSize()
  }, 10)

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
    const appStore = useAppStore()
    if (appStore.appHasUnsavedChanges) {
      appStore.showUnsavedChangesModal = true
      e.preventDefault()
    }
  } 
  
// TODO check if still needed or better route
  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  const initializeApp = async () => {
    await refreshTokens();
  
    let cachedLocalUser = checkIfCacheExpired('localUser');
    let cachedUserRecipes = checkIfCacheExpired('userRecipes');
    let cachedAllTags = checkIfCacheExpired('allTags');
    const cachedPublicRecipes = checkIfCacheExpired('publicRecipes');
    const cachedSelectedRecipeId = sessionStorage.getItem('selectedRecipeId') ?? undefined;
    const cachedEditSelectedRecipe = sessionStorage.getItem('editSelectedRecipe') === 'true' || false;
    const cachedShoppingLists = checkIfCacheExpired('shoppingLists');

    if (
      !cachedUserRecipes ||
      !cachedLocalUser ||
      !cachedAllTags ||
      !cachedShoppingLists ||
      !cachedPublicRecipes
    ) {
      // TODO No userId in here
      const {userData, userRecipes} = await dataService.getCurrentUserData();
      cachedLocalUser = userData;
      cachedUserRecipes = userRecipes;
      // TODO add when implementing tags
      cachedAllTags = [];
    }
    recipeStore.hydrateStore({ 
      recipes: cachedUserRecipes, 
      allTags: cachedAllTags, 
      existingPublicRecipes: cachedPublicRecipes, 
      selectedRecipeId: cachedSelectedRecipeId, 
      editSelectedRecipe: cachedEditSelectedRecipe 
    });
    userStore.setInitialUserState({ localUser: cachedLocalUser, authorized: true});
    shoppingListStore.hydrateStore(cachedShoppingLists);
    console.log('Stores hydrated');
  }

  const refreshTokens = async () => {
    try {
      const refreshTokenResponse = await axios.post('/admin/refresh-token');
      appStore.setAcessToken(refreshTokenResponse.data.accessToken)
    } catch (error) {
      console.log('token refresh failiure: ', error);
      throw new Error('Token Refresh Failed, relogin');
    }
  }

  return {
    onResize,
    handleUnsavedChanges,
    initializeApp,
    refreshTokens,
  }
}
