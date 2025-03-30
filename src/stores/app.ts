import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRecipeStore } from './recipe'
import { useUserStore } from './user'
import { useShoppingListStore } from './shoppingList'
import { useAuthService } from '@/composables/useAuthService'
import { UserState } from '@/types/UserState'
import { Recipe } from '@/types/Recipes'
import { useAppService } from '@/composables/useAppService'

type ScreenSize = 'sm' | 'md' | 'lg'

export const useAppStore = defineStore('app', () => {
  const recipeStore = useRecipeStore();
  const userStore = useUserStore();
  const shoppingListStore = useShoppingListStore();
  const authService = useAuthService();
  const appService = useAppService();

  const testModeOn = ref(false);
  const registrationOrSigninModal = ref('');
  const screenSize = ref<ScreenSize>('lg');
  const isMobileMenuOpen = ref(false);
  const appHasUnsavedChanges = ref(true);
  const showUnsavedChangesModal = ref(false);
  const userCsrfToken = ref('');

  const isTestModeOn = computed(() => testModeOn.value)
  const isRegistrationModalOpen = computed(() => registrationOrSigninModal.value.length > 0)

  function initializeApp(userData: UserState, publicRecipeData: Recipe[]) {
    console.log('initializing App with user Data: ', userData)
    console.log('initializing App with public Recipes Data: ', publicRecipeData)
    const userId = userData._id
    userStore.setInitialUserState(userData)
    recipeStore.setInitialRecipeState(userData, publicRecipeData)
    shoppingListStore.setListState(userId, userData.localUser.shoppingLists || [])
  }

  function resetAppStates() {
    userStore.resetState()
    recipeStore.resetState()
    shoppingListStore.resetState()
    resetState()
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

  function toggleRegistrationModal(type?: string) {
    registrationOrSigninModal.value = ''

    setTimeout(() => {
      registrationOrSigninModal.value = type || ''
    }, 10)
  }

  function setScreenSize(updatedScreenSize: ScreenSize) {
    console.log('screen size setting!: ', updatedScreenSize)
    screenSize.value = updatedScreenSize
  }

  async function fetchCsrfToken() {
    console.log('fetching token');
    const csrfToken = await appService.fetchCsrfToken();
    if (csrfToken) {
      console.log('found token: ', csrfToken)
      userCsrfToken.value = csrfToken;
    } else {
      console.log('get from token');
      // csrfToken.value = this.getTokenFromCookie();
    }
    
    return true;
  }

  function resetState() {
    testModeOn.value = false
    registrationOrSigninModal.value = ''
  }

  return {
    testModeOn,
    screenSize,
    isMobileMenuOpen,
    appHasUnsavedChanges,
    showUnsavedChangesModal,
    userCsrfToken,
    registrationOrSigninModal,
    isTestModeOn,
    isRegistrationModalOpen,
    initializeApp,
    resetAppStates,
    turnTestModeOn,
    turnTestModeOff,
    toggleRegistrationModal,
    setScreenSize,
    fetchCsrfToken,
    resetState
  }
})
