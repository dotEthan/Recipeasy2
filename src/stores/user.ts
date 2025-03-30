import type { LocalUser, UserState } from '@/types/UserState';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const _id = ref('');

  // TODO Not needed, get from localUser object. Single point of truth
  const authorized = ref<boolean | null>(false);
  const localUser = ref<LocalUser>({_id: '', displayName: '', verified: false});
  const personalFilters = ref<string[]>([]);

  const isAuthorized = computed(() => authorized.value);
  const isUserVerified = computed(() => localUser.value.verified);
  const getCurrentUser = computed(() => localUser.value);
  const getCurrentUserId = computed(() => localUser.value._id);

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
    _id.value = userState._id;
    authorized.value = userState.authorized;
    localUser.value = userState.localUser;
    personalFilters.value = userState.localUser.preferences?.personalFilters || [];
  }

  function verifyUser() {
    localUser.value.verified = true;
  }

  function resetState() {
    _id.value = '';
    authorized.value = false;
    localUser.value = {_id: '', verified: false};
  }

  return {
    _id,
    authorized,
    localUser,
    personalFilters,
    isAuthorized,
    isUserVerified,
    getCurrentUser,
    getCurrentUserId,
    deauthorize,
    authorize,
    setLocalUser,
    setInitialUserState,
    verifyUser,
    resetState,
  };
})
