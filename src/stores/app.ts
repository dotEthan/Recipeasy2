import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useRecipeStore } from './recipe'
import { useUserStore } from './user'
import { useShoppingListStore } from './shoppingList'
import { useAuthService } from '@/composables/useAuthService'
import { useAppService } from '@/composables/useAppService'
import { useDataService } from '@/composables/useDataService'
import { getSessionData, isCacheExpired, setSessionData } from '@/utilities'
import { CachedRecipeState } from '@/types/Recipes'
import { CachedUserState } from '@/types/UserState'
import { CachedAppState, InitialAppState } from '@/types/AppState'
import { CachedShoppingListState } from '@/types/ShoppingLists'
import { CACHED_DATA_TTL } from '@/constants'

type ScreenSize = 'sm' | 'md' | 'lg'

export const useAppStore = defineStore('app', () => {
  const recipeStore = useRecipeStore();
  const userStore = useUserStore();
  const shoppingListStore = useShoppingListStore();
  const authService = useAuthService();
  const appService = useAppService();
  const dataService = useDataService();

  // Variables
  const testModeOn = ref(false);
  const authModalType = ref('');
  const screenSize = ref<ScreenSize>('lg');
  const isMobileMenuOpen = ref(false);
  const appHasUnsavedChanges = ref(false);
  const showUnsavedChangesModal = ref(false);
  const userCsrfToken = ref('');
  const isLoading = ref(false);
  const lightMode = ref(true);

  // Computed
  const isTestModeOn = computed(() => testModeOn.value)
  const isAuthModalOpen = computed(() => authModalType.value.length > 0)


  // Functions 
  async function initializeApp() {
    try { 
      const cachedUserStore = getSessionData('userData') as CachedUserState;
      const cachedRecipeStore = getSessionData('recipes') as CachedRecipeState;
      const cachedShoppingListStore = getSessionData('shoppingLists') as CachedShoppingListState;
      const cachedAppStore = getSessionData('appState') as CachedAppState;

      // Check session
      const sessionActiveresponse = await appService.checkSession();
      console.log('checking Sesesion: ', sessionActiveresponse)

      const sessionIsActive = sessionActiveresponse.success
      const activeUser = sessionActiveresponse.data
      if (!activeUser) throw new Error('No active user, relog in - toast display, no breaking');
      userStore.setLocalUser(activeUser)

      console.log('cached Data: User: ', isCacheExpired(cachedUserStore.expiresAt))
      console.log('cached Data: recipes: ', cachedRecipeStore)
      console.log('cached Data: app: ', cachedAppStore)
      console.log('cached Data: SL: ', cachedShoppingListStore)
      if (sessionIsActive) {
        if(!activeUser) throw new Error('session active but no active user. relogin')
        console.log('user session still active')
        if ((!cachedUserStore || isCacheExpired(cachedUserStore.expiresAt)) 
          || (!cachedRecipeStore || isCacheExpired(cachedRecipeStore.expiresAt))
          || (!cachedAppStore || isCacheExpired(cachedAppStore.expiresAt)) 
          || (!cachedShoppingListStore || isCacheExpired(cachedShoppingListStore.expiresAt))) {

            console.log('no, or old, saved data')
          const publicRecipes = await dataService.getPublicRecipes();
          const userData = await dataService.getUserData();
          
          hydrateStore({lightMode: userData.userData.preferences?.lightMode || true})
          userStore.setInitialUserState({authorized: true, localUser: userData.userData})
          recipeStore.setInitialPublicRecipeState(publicRecipes);
          recipeStore.setInitialUserRecipeState(userData.userRecipes);
          shoppingListStore.hydrateStore(userData.userData.shoppingLists || []);
          userStore.cacheUserState();
          recipeStore.cacheRecipeState();
          shoppingListStore.cacheListState();
          cacheAppState();

        } else {
          console.log('cachedData exists')
          // TODO remove expiresAt
          hydrateStore(cachedAppStore);
          userStore.hydratestore(cachedUserStore); 
          recipeStore.hydrateStore(cachedRecipeStore);
          shoppingListStore.hydrateStore(cachedShoppingListStore.shoppingLists);

          // set app state
          // If data is older than X, make call to refresh, set TTL when saving
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // TODO make sure logged out and all stores/saved Data is reset
        resetAppStates();
      }
    }
  }

  function setInitialAppState(appState: InitialAppState) {
    testModeOn.value = appState.testModeOn || false;
    authModalType.value = appState.authModalType || '';
    isMobileMenuOpen.value = appState.isMobileMenuOpen || false;
    isLoading.value = true;
    lightMode.value = appState.lightMode || true;
  }

  function resetAppStates() {
    userStore.resetState()
    recipeStore.resetUserRecipeState()
    shoppingListStore.resetState()
    resetState()
    
    // Pesistent Data Stored in Browser
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userRecipes');
    sessionStorage.removeItem('publicRecipes');

    console.log('all stores reset')
  }

  async function turnTestModeOn() {
    try {
      await authService.signIn('testmode@testmode.com', 'password')
      testModeOn.value = true
    } catch (error) {
      console.log('TestMode Turn On Failed: ', error)
    }
  }

  function turnTestModeOff() {
    testModeOn.value = false
    resetAppStates()
  }

  function setAuthModalType(type?: string) {
    authModalType.value = ''
    console.log('toggling: ', type)
    // TODO Work work without, figure out why.
    setTimeout(() => {
      authModalType.value = type || ''
    }, 10)
  }

  function setScreenSize(updatedScreenSize: ScreenSize) {
    console.log('screen size setting!: ', updatedScreenSize)
    screenSize.value = updatedScreenSize
  }

  async function fetchCsrfToken() {
    const csrfToken = await appService.fetchCsrfToken();
    if (csrfToken) {
      userCsrfToken.value = csrfToken;
    } else {
      throw new Error('CsrfToken Not Updated, Retry?')
    }
    
    return true;
  }

  function isLoadingToggle() {
    isLoading.value = !isLoading.value;
  }

  function hydrateStore(appState: InitialAppState) {
    testModeOn.value = appState.testModeOn || false;
    authModalType.value = appState.authModalType || '';
    isMobileMenuOpen.value = appState.isMobileMenuOpen || false;
    lightMode.value = appState.lightMode || true;
  }

  function cacheAppState() {
    setSessionData('appState', {
      testModeOn: testModeOn.value,
      authModalType: authModalType.value,
      isMobileMenuOpen: isMobileMenuOpen.value,
      lightMode: lightMode.value,
      expiresAt: new Date().getTime() + (CACHED_DATA_TTL)
    })
  }

  function resetState() {
    testModeOn.value = false
    authModalType.value = ''
  }

  return {
    testModeOn,
    screenSize,
    isMobileMenuOpen,
    appHasUnsavedChanges,
    showUnsavedChangesModal,
    userCsrfToken,
    isLoading,
    lightMode,
    authModalType,
    isTestModeOn,
    isAuthModalOpen,
    initializeApp,
    setInitialAppState,
    resetAppStates,
    turnTestModeOn,
    turnTestModeOff,
    setAuthModalType,
    setScreenSize,
    fetchCsrfToken,
    isLoadingToggle,
    hydrateStore,
    cacheAppState,
    resetState
  }
})
