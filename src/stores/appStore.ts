import { ref, computed, watchEffect } from 'vue'
import { defineStore } from 'pinia'

import { useRecipeStore } from './recipeStore'
import { useUserStore } from './userStore'
import { useShoppingListStore } from './shoppingListStore'
import { InitialAppState } from '@/types/AppState'

/**
 * Store for all App State
 * @todo Update Mock Store and Apply store types
 * @todo ScreenSize to enum
 */

type ScreenSize = 'sm' | 'md' | 'lg'

export const useAppStore = defineStore('app', () => {
  const recipeStore = useRecipeStore();
  const userStore = useUserStore();
  const shoppingListStore = useShoppingListStore();

  // Variables
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
    sessionStorage.setItem('authModalType', authModalType.value);
    sessionStorage.setItem('screenSize', screenSize.value);
    sessionStorage.setItem('isMobileMenuOpen', String(isMobileMenuOpen.value));
    sessionStorage.setItem('lightMode', String(lightMode.value));
  });

  // Computed
  const isAuthModalOpen = computed(() => authModalType.value.length > 0)


  // Functions 

  function setInitialAppState(appState: InitialAppState) {
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
  }

  function setAuthModalType(type?: string) {
    authModalType.value = ''
    // TODO Work work without, figure out why.
    setTimeout(() => {
      authModalType.value = type || ''
    }, 10)
  }

  function setScreenSize(updatedScreenSize: ScreenSize) {
    screenSize.value = updatedScreenSize
  }
  
  async function setAcessToken(token: string) {
    accessToken.value = token;
  }

  function isLoadingToggle() {
    isLoading.value = !isLoading.value;
  }

  function hydrateStore(appState: InitialAppState) {
    authModalType.value = appState.authModalType || '';
    isMobileMenuOpen.value = appState.isMobileMenuOpen || false;
    lightMode.value = appState.lightMode || true;
  }

  function resetState() {
    authModalType.value = '';
    accessToken.value = '';
  }

  return {
    screenSize,
    isMobileMenuOpen,
    appHasUnsavedChanges,
    showUnsavedChangesModal,
    accessToken,
    isLoading,
    lightMode,
    authModalType,
    isAuthModalOpen,
    setInitialAppState,
    resetAppStates,
    setAuthModalType,
    setScreenSize,
    setAcessToken,
    isLoadingToggle,
    hydrateStore,
    resetState
  }
})
