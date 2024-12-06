import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRecipeStore } from './recipe'
import { useUserStore } from './user'
import { useShoppingListStore } from './shoppingList'
import { useAuthService } from '@/composables/useAuthService'
import { UserState } from '@/types/UserState'

type ScreenSize = 'sm' | 'md' | 'lg'

export const useAppStore = defineStore('app', () => {
  const recipeStore = useRecipeStore()
  const userStore = useUserStore()
  const shoppingListStore = useShoppingListStore()
  const authService = useAuthService()

  const testModeOn = ref(false)
  const registrationOrSigninModal = ref('')
  const screenSize = ref<ScreenSize>('lg')
  const isMobileMenuOpen = ref(false)
  const appHasUnsavedChanges = ref(true)
  const showUnsavedChangesModal = ref(false)

  const isTestModeOn = computed(() => testModeOn.value)
  const isRegistrationModalOpen = computed(() => registrationOrSigninModal.value.length > 0)

  function initializeApp(userData: UserState) {
    console.log('initializing App with user Data: ', userData)
    const userId = userData.uid
    userStore.setInitialUserState(userData)
    recipeStore.setInitialRecipeState(userId, userData.localUser.recipes || [])
    shoppingListStore.setListState(userId, userData.localUser.shoppingLists || [])
  }

  function resetAppStates() {
    userStore.resetState()
    recipeStore.resetState()
    shoppingListStore.resetState()
    resetState()
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

  function toggleRegistrationModal(type?: string) {
    registrationOrSigninModal.value = ''

    setTimeout(() => {
      registrationOrSigninModal.value = type || ''
    }, 10)
  }

  function setScreenSize(updatedScreenSize: ScreenSize) {
    console.log('screen size setting!: ', updatedScreenSize)
    screenSize.value = updatedScreenSize
  }

  function resetState() {
    testModeOn.value = false
    registrationOrSigninModal.value = ''
  }

  return {
    testModeOn,
    screenSize,
    isMobileMenuOpen,
    appHasUnsavedChanges,
    showUnsavedChangesModal,
    registrationOrSigninModal,
    isTestModeOn,
    isRegistrationModalOpen,
    initializeApp,
    resetAppStates,
    turnTestModeOn,
    turnTestModeOff,
    toggleRegistrationModal,
    setScreenSize,
    resetState
  }
})
