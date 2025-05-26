import { defineStore } from "pinia";

import { computed, ref, watchEffect } from "vue";

import { useRecipeStore } from "@/stores/recipeStore";
import { useShoppingListStore } from "@/stores/shoppingListStore";
import { useUserStore } from "@/stores/userStore";
import { AppStore, InitialAppState, ScreenSize } from "@/types/AppState.d";

/**
 * Store for all App State
 * @todo Update Mock Store and Apply store types
 * @todo ScreenSize to enum
 */

export const useAppStore = defineStore("app", (): AppStore => {
  const recipeStore = useRecipeStore();
  const userStore = useUserStore();
  const shoppingListStore = useShoppingListStore();

  // Variables
  const authModalType = ref<string>("");
  const screenSize = ref<ScreenSize>("lg");
  const isMobileMenuOpen = ref<boolean>(false);
  const appHasUnsavedChanges = ref<boolean>(false);
  const showUnsavedChangesModal = ref<boolean>(false);
  const accessToken = ref<string>("");
  const isLoading = ref<boolean>(false);
  const lightMode = ref<boolean>(true);

  // Watchers
  watchEffect(() => {
    sessionStorage.setItem("authModalType", authModalType.value);
    sessionStorage.setItem("screenSize", screenSize.value);
    sessionStorage.setItem("isMobileMenuOpen", String(isMobileMenuOpen.value));
    sessionStorage.setItem("lightMode", String(lightMode.value));
  });

  // Computed
  const isAuthModalOpen = computed(() => authModalType.value.length > 0);
  const recipesPerCollection = computed(() => (screenSize.value !== ScreenSize.SMALL ? 5 : 6));

  // Functions

  function setInitialAppState(appState: InitialAppState) {
    authModalType.value = appState.authModalType || "";
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

  function setAuthModalType(type: string) {
    authModalType.value = "";
    // TODO Work work without, figure out why.
    setTimeout(() => {
      authModalType.value = type;
    }, 10);
  }

  function setScreenSize(updatedScreenSize: ScreenSize) {
    screenSize.value = updatedScreenSize;
  }

  async function setAcessToken(token: string) {
    accessToken.value = token;
  }

  function isLoadingToggle() {
    isLoading.value = !isLoading.value;
  }

  function hydrateStore(appState: InitialAppState) {
    authModalType.value = appState.authModalType || "";
    isMobileMenuOpen.value = appState.isMobileMenuOpen || false;
    lightMode.value = appState.lightMode || true;
  }

  function resetState() {
    authModalType.value = "";
    accessToken.value = "";
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
    recipesPerCollection,

    setInitialAppState,
    resetAppStates,
    setAuthModalType,
    setScreenSize,
    setAcessToken,
    isLoadingToggle,
    hydrateStore,
    resetState
  };
});
