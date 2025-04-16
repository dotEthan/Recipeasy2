import { ref, onMounted, onUnmounted } from 'vue'
import axios from '@/axios';
import { useAppStore } from '@/stores/app'
import { useRecipeStore } from '@/stores/recipe';
import { useUserStore } from '@/stores/user';
import { debounce } from '@/utilities';
import { StandardRecipeApiResponse } from '@/types/ApiResponse';
import { Recipe, RecipeStore } from '@/types/Recipes';
import type { ScreenSize } from '@/types/ScreenSize'
import { UserState } from '@/types/UserState';
import { useShoppingListStore } from '@/stores/shoppingList';
import { ShoppingList, ShoppingListState } from '@/types/ShoppingLists';

/**
 * Handles all methods to help bootstrap the App: CSRF tokens, screen size tracking.
 * @returns {Object} - onResize, handleUnsavedChanges, fetchCsrfToken, checkSession, hydrateStores
 */

export function useAppService() {
  const appStore = useAppStore();
  const recipeStore = useRecipeStore();
  const userStore = useUserStore();
  const shoppingListStore = useShoppingListStore();
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

  /**
   * Get the CSRF token on page reload
   * @param {} - Nothing!
   * @returns {Promise<string>} - The precious csrfToken. My precious... 
   * @example
  * const { fetchCsrfToken } = useAppService();
  * const token = await fetchCsrfToken();
   */
  const fetchCsrfToken = async (): Promise<string | null> => {
    try {
      const response = await axios.get('/csrf-token', { 
        withCredentials: true 
      });
      console.log('featching response: ', response)
      return response.data.csrfToken;
    } catch (error: unknown) {
      console.error('Failed to fetch CSRF token', error);
      return null;
    }
  }

  
  /**
   * Check that backend session is still valid during app initialization
   * @param {} - Nothing!
   * @returns {Promise<boolean>} - whether the session is still active (true/false)
   * @example
  * const { checkSession } = useAppService();
  * const isSessionActive = await checkSession();
   */
  const checkSession = async (): Promise<StandardRecipeApiResponse> => {
    const response = await axios.get('/check-session', { 
      withCredentials: true 
    });
    console.log('cehckigng sessions res: ', response)
    return response.data;
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  return {
    onResize,
    handleUnsavedChanges,
    fetchCsrfToken,
    checkSession,
  }
}
