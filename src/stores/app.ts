import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRecipeStore } from './recipe'
import { useUserStore } from './user'
import { useShoppingListStore } from './shoppingList'
import { useAuthService } from '@/composables/useAuthService'
import { UserState } from '@/types/UserState'
import { Recipe } from '@/types/Recipes'
import { useAppService } from '@/composables/useAppService'
import { useDataService } from '@/composables/useDataService'
import axios from 'axios'

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
  const appHasUnsavedChanges = ref(true);
  const showUnsavedChangesModal = ref(false);
  const userCsrfToken = ref('');
  const isLoading = ref(false);

  // Computed
  const isTestModeOn = computed(() => testModeOn.value)
  const isAuthModalOpen = computed(() => authModalType.value.length > 0)


  // Functions 
  async function initializeApp() {
    try {
      
      const cachedUser = sessionStorage.getItem('user');
      const cachedUserRecipes = sessionStorage.getItem('userRecipes');
      const cachedPublicRecipes = sessionStorage.getItem('publicRecipes');

      // Check session
      console.log('checking Sesesion: ', )
      const sessionActiveresponse = await appService.checkSession();
      console.log('checking Sesesion: ', sessionActiveresponse)
      const sessionIsActive = sessionActiveresponse.success
      const activeUser = sessionActiveresponse.data



      // TEST IT AND THEN TEST BELOW - User Session is NOT active always
      if (sessionIsActive) {
        if(!activeUser) throw new Error('session active but no active user. relogin')
        console.log('user session still active')
        
        if (!cachedUser || !cachedUserRecipes || !cachedPublicRecipes) {

          const publicRecipes = await dataService.getPublicRecipes();
          const {userData, userRecipes} = await dataService.getUserData();

          recipeStore.setInitialPublicRecipeState(publicRecipes);
          recipeStore.setInitialUserRecipeState(userRecipes);
          userStore.setInitialUserState({authorized: true, localUser: userData});
        } else {
          recipeStore.setInitialPublicRecipeState(JSON.parse(cachedPublicRecipes));
          recipeStore.setInitialUserRecipeState(JSON.parse(cachedUserRecipes));
          userStore.setInitialUserState(JSON.parse(cachedUser));
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

  function setAuthorizedUserData(userData: UserState, userRecipeData: Recipe[]) {
    console.log('set App with user Data: ', userData)
    console.log('set App with user Data: ', userRecipeData)
    const userId = userData.localUser._id
    userStore.setInitialUserState(userData)
    recipeStore.setInitialUserRecipeState(userRecipeData)
    shoppingListStore.setListState(userId, userData.localUser.shoppingLists || [])
  }

  function initializePublicRecipeData(userData: UserState, publicRecipeData: Recipe[]) {
    const userId = userData.localUser._id
    userStore.setInitialUserState(userData)
    recipeStore.setInitialPublicRecipeState(publicRecipeData)
    shoppingListStore.setListState(userId, userData.localUser.shoppingLists || [])
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
    authModalType,
    isTestModeOn,
    isAuthModalOpen,
    initializeApp,
    setAuthorizedUserData,
    initializePublicRecipeData,
    resetAppStates,
    turnTestModeOn,
    turnTestModeOff,
    setAuthModalType,
    setScreenSize,
    fetchCsrfToken,
    isLoadingToggle,
    resetState
  }
})
