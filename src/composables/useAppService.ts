import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import axios from '@/axios';
import type { ScreenSize } from '@/types/ScreenSize'
import { debounce } from '@/utilities';
/**
 * Handles all methods to help bootstrap the App: CSRF tokens, screen size tracking.
 * @returns {Object} - onResize, handleUnsavedChanges, fetchCsrfToken.
 */

export function useAppService() {
  const appStore = useAppStore()
  const screenWidth = ref(window.innerWidth)

  /**
   * Updates the screensize variable in the appStore for business rules
   * @param {} - None
   * @returns {Promise<void>} - The dark void.
   * @example
  * const { updatescreenSize } = useAppService();
   * updatescreenSize();
   */

  // TODO better practice
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
   * Lookig to ensure users can't leave without saving.
   * @param {e} - Event object
   * @returns {Promise<void>} - The dark void.
   * @example
  * const { handleUnsavedChanges } = useAppService();
   * handleUnsavedChanges();
   */
  // TODO REmove once pesistence and immediate saving reworked
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
   * When the page loads, if available
   * @param {} - None
   * @returns {Promise<void>} - The dark void.
   * @example
  * const { updatescreenSize } = useAppService();
   * updatescreenSize();
   */
  const hydrateStores = async () => {
    // Hydrate stores 
    // call in app.vue
    const cachedData = sessionStorage.getItem('cachedStores');

    const { user, recipes, timestamp } = (cachedData) ? JSON.parse(cachedData) : {};

    const isFresh = timestamp && (Date.now() - timestamp < SESSION_STORAGE_EXPIRY);

    if (isFresh) {
      appStore.initializeApp(user, recipes)
    } else {
      // TODO Make API calls for fresh data
      console.log('call API Please');
    }

  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  return {
    onResize,
    handleUnsavedChanges,
    fetchCsrfToken,
    hydrateStores, 
  }
}
