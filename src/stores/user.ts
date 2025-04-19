import { CACHED_DATA_TTL } from '@/constants';
import type { LocalUser, UserState } from '@/types/UserState';
import { setSessionData } from '@/utilities';
import { ObjectId } from 'bson';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const authorized = ref<boolean | null>(false);
  const localUser = ref<LocalUser|undefined>();

  const isAuthorized = computed(() => authorized.value);
  const isUserVerified = computed(() => localUser.value?.verified);
  const getCurrentUser = computed(() => localUser.value);
  const getCurrentUserId = computed(() => localUser.value?._id);
  const getUserPersonalPreferences = computed(() => localUser.value?.preferences?.personalFilters);

  function deauthorize() {
    authorized.value = false;
  }

  function authorize() {
    authorized.value = true;
  }

  function setLocalUser(user: LocalUser) {
    console.log('inside set localUser local user: ', user);
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

  function updateLocalUserRecipeArray(recipeId: ObjectId) {
    localUser.value?.recipes?.push({_id: recipeId});
  }

  function hydratestore(userState: UserState) {
    authorized.value = userState.authorized;
    localUser.value = userState.localUser;
  }

  function cacheUserState() {
    setSessionData('userData', {
      authorized: authorized.value,
      localUser: localUser.value,
      expiresAt: new Date().getTime() + (CACHED_DATA_TTL)
    })
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
    getUserPersonalPreferences,
    deauthorize,
    authorize,
    setLocalUser,
    setInitialUserState,
    verifyUser,
    updateLocalUserRecipeArray,
    hydratestore,
    cacheUserState,
    resetState,
  };
})
