import { defineStore } from "pinia";

import { computed, ref, watchEffect } from "vue";

import { ScreenSize } from "@/constants";
import { useRecipeStore } from "@/stores/recipeStore";
import { useShoppingListStore } from "@/stores/shoppingListStore";
import { useUserStore } from "@/stores/userStore";
import { AppStore, InitialAppState } from "@/types/AppState.d";

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
  const screenSize = ref<ScreenSize>("xs");
  const isMobileMenuOpen = ref<boolean>(false);
  const appHasUnsavedChanges = ref<boolean>(false);
  const showUnsavedChangesModal = ref<boolean>(false);
  const accessToken = ref<string>("");
  const isLoading = ref<boolean>(false);
  const lightMode = ref<boolean>(true);

  // Watchers
  watchEffect(() => {
    sessionStorage.setItem("authModalType-cached", authModalType.value);
    sessionStorage.setItem("screenSize-cached", screenSize.value);
    sessionStorage.setItem("isMobileMenuOpen-cached", String(isMobileMenuOpen.value));
    sessionStorage.setItem("lightMode-cached", String(lightMode.value));
  });

  // Computed
  const isAuthModalOpen = computed(() => authModalType.value.length > 0);
  const recipesPerCollection = computed(() => (screenSize.value !== "xs" ? 12 : 10));

  // Functions

  function setInitialAppState(appState: InitialAppState) {
    authModalType.value = appState.authModalType || "";
    isMobileMenuOpen.value = appState.isMobileMenuOpen || false;
    isLoading.value = true;
    lightMode.value = appState.lightMode || true;
  }

  function toggleLightMode() {
    lightMode.value = !lightMode.value;

    const root = document.documentElement;
    lightMode.value ? root.classList.remove("dark") : root.classList.add("dark");
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
    toggleLightMode,
    resetAppStates,
    setAuthModalType,
    setScreenSize,
    setAcessToken,
    isLoadingToggle,
    hydrateStore,
    resetState
  };
});
