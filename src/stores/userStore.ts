import { defineStore } from "pinia";

import { computed, ref, watch } from "vue";

import type { LocalUser, UserState, UserStore } from "@/types/UserState.d";
import { formatCachedValue } from "@/utilities";

export const useUserStore = defineStore("user", (): UserStore => {
  // Variables
  const authorized = ref<boolean | null>(false);
  const localUser = ref<LocalUser | undefined>();

  // Watchers
  watch(
    () => localUser.value,
    (newLocalUser: LocalUser | undefined) => {
      sessionStorage.setItem("localUser", formatCachedValue(newLocalUser));
    },
    { deep: true }
  );

  // Computed Values
  const isAuthorized = computed(() => authorized.value);
  const isUserVerified = computed(() => localUser.value?.verified);
  const getCurrentUser = computed(() => localUser.value);
  const getCurrentUserId = computed(() => localUser.value?._id);
  const getCurrentUserEmail = computed(() => localUser.value?.email);
  const getUserPersonalPreferences = computed(() => localUser.value?.preferences?.personalFilters);

  // Functions
  function deauthorize() {
    authorized.value = false;
  }

  function authorize() {
    authorized.value = true;
  }

  function setLocalUser(user: LocalUser) {
    localUser.value = user;
  }

  function setInitialUserState(userState: UserState) {
    authorized.value = userState.authorized;
    localUser.value = userState.localUser;
  }

  function verifyUser() {
    if (localUser.value) {
      localUser.value.verified = true;
    }
  }

  function addIdToLocalUserRecipes(recipeId: string) {
    localUser.value?.recipes?.push({ id: recipeId });
  }

  function removeIdFromLocalUserRecipes(recipeId: string) {
    if (!localUser.value) return;

    localUser.value.recipes =
      localUser.value.recipes?.filter((recipe) => {
        return recipe.id !== recipeId;
      }) ?? [];
  }

  function hydratestore(userState: UserState) {
    authorized.value = userState.authorized;
    localUser.value = userState.localUser;
  }

  function resetState() {
    authorized.value = false;
    localUser.value = undefined;
  }

  return {
    authorized,
    localUser,
    isAuthorized,
    isUserVerified,
    getCurrentUser,
    getCurrentUserId,
    getCurrentUserEmail,
    getUserPersonalPreferences,
    deauthorize,
    authorize,
    setLocalUser,
    setInitialUserState,
    verifyUser,
    addIdToLocalUserRecipes,
    removeIdFromLocalUserRecipes,
    hydratestore,
    resetState
  };
});
