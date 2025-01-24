import type { LocalUser, UserState } from '@/types/UserState'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const uid = ref('')
  const authorized = ref<boolean | null>(false)
  const localUser = ref<LocalUser>({uid: '', displayName: ''})
  const personalFilters = ref<string[]>([])

  const isAuthorized = computed(() => authorized.value)
  const getCurrentUser = computed(() => localUser.value)
  const getCurrentUserId = computed(() => localUser.value.uid)

  function deauthorize() {
    authorized.value = false
  }

  function authorize() {
    authorized.value = true
  }

  function setLocalUser(user: LocalUser) {
    console.log('inside set localUser local user: ', user)
    localUser.value = user
  }

  function setInitialUserState(userState: UserState) {
    uid.value = userState.uid
    authorized.value = userState.authorized
    localUser.value = userState.localUser
    personalFilters.value = userState.localUser.personalFilters || []
  }

  function resetState() {
    uid.value = ''
    authorized.value = false
    localUser.value = {uid: ''}
  }

  return {
    uid,
    authorized,
    localUser,
    personalFilters,
    isAuthorized,
    getCurrentUser,
    getCurrentUserId,
    deauthorize,
    authorize,
    setLocalUser,
    setInitialUserState,
    resetState,
  }
})
