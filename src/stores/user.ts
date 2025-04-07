import type { LocalUser, UserState } from '@/types/UserState';
import { ObjectId } from 'bson';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const authorized = ref<boolean | null>(false);
  const localUser = ref<LocalUser|undefined>({_id: new ObjectId(), displayName: '', verified: false});

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
    resetState,
  };
})
