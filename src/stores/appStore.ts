import { ref, computed, watchEffect } from 'vue'
import { defineStore } from 'pinia'

import { useRecipeStore } from './recipeStore'
import { useUserStore } from './userStore'
import { useShoppingListStore } from './shoppingListStore'
import { useAuthService } from '@/composables/useAuthService'
import { InitialAppState } from '@/types/AppState'

/**
 * Store for all App State
 * @todo Update Mock Store and Apply store types
 * @todo ScreenSize to enum
 * @returns {Object} - testModeOn, screenSize, isMobileMenuOpen, appHasUnsavedChanges, showUnsavedChangesModal, accessToken, isLoading, lightMode, authModalType, isTestModeOn, isAuthModalOpen, initializeApp, setInitialAppState, resetAppStates, turnTestModeOn, turnTestModeOff, setAuthModalType, setScreenSize, setAccessToken, isLoadingToggle, hydrateStore, cacheAppState, resetState
 */

type ScreenSize = 'sm' | 'md' | 'lg'

export const useAppStore = defineStore('app', () => {
  const recipeStore = useRecipeStore();
  const userStore = useUserStore();
  const shoppingListStore = useShoppingListStore();
  const authService = useAuthService();

  // Variables
  const testModeOn = ref(false);
  const authModalType = ref('');
  const screenSize = ref<ScreenSize>('lg');
  const isMobileMenuOpen = ref(false);
  const appHasUnsavedChanges = ref(false);
  const showUnsavedChangesModal = ref(false);
  const accessToken = ref('');
  const isLoading = ref(false);
  const lightMode = ref(true);

  // Watchers
  watchEffect(() => {
    sessionStorage.setItem('testModeOn', String(testModeOn.value));
    sessionStorage.setItem('authModalType', authModalType.value);
    sessionStorage.setItem('screenSize', screenSize.value);
    sessionStorage.setItem('isMobileMenuOpen', String(isMobileMenuOpen.value));
    sessionStorage.setItem('lightMode', String(lightMode.value));
  });

  // Computed
  const isTestModeOn = computed(() => testModeOn.value)
  const isAuthModalOpen = computed(() => authModalType.value.length > 0)


  // Functions 

  function setInitialAppState(appState: InitialAppState) {
    testModeOn.value = appState.testModeOn || false;
    authModalType.value = appState.authModalType || '';
    isMobileMenuOpen.value = appState.isMobileMenuOpen || false;
    isLoading.value = true;
    lightMode.value = appState.lightMode || true;
  }

  function resetAppStates() {
    userStore.resetState();
    recipeStore.resetUserRecipeState();
    shoppingListStore.resetState();
    resetState();
    
    // Pesistent Data Stored in Browser
    sessionStorage.clear();

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
  
  async function setAcessToken(token: string) {
    accessToken.value = token;
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

  function resetState() {
    testModeOn.value = false;
    authModalType.value = '';
    accessToken.value = '';
  }

  return {
    testModeOn,
    screenSize,
    isMobileMenuOpen,
    appHasUnsavedChanges,
    showUnsavedChangesModal,
    accessToken,
    isLoading,
    lightMode,
    authModalType,
    isTestModeOn,
    isAuthModalOpen,
    setInitialAppState,
    resetAppStates,
    turnTestModeOn,
    turnTestModeOff,
    setAuthModalType,
    setScreenSize,
    setAcessToken,
    isLoadingToggle,
    hydrateStore,
    resetState
  }
})
