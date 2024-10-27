import type { LocalUser, UserState } from '@/types/UserState'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const uid = ref('')
  const authorized = ref(false)
  const localUser = ref<LocalUser>({})

  const isAuthorized = computed(() => authorized.value)
  const getCurrentUser = computed(() => localUser.value)

  function deauthorize() {
    authorized.value = false
  }

  function authorize() {
    authorized.value = true
  }

  function setLocalUser(user: LocalUser) {
    localUser.value = user
  }

  function setInitialUserState(userState: UserState) {
    uid.value = userState.uid
    authorized.value = userState.authorized
    localUser.value = userState.localUser
  }

  function resetState() {
    uid.value = ''
    authorized.value = false
    localUser.value = {}
  }

  function setTestModeOn(testData: LocalUser) {
    uid.value = 'testMode'
    authorized.value = true
    localUser.value = { ...testData }
  }

  return {
    uid,
    authorized,
    localUser,
    isAuthorized,
    getCurrentUser,
    deauthorize,
    authorize,
    setLocalUser,
    setInitialUserState,
    resetState,
    setTestModeOn
  }
})
