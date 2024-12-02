import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRecipeStore } from './recipe'

import { useUserStore } from './user'

import dummyData from '../assets/dummyData.json'
import { useShoppingListStore } from './shoppingList'
import { useAuthService } from '@/composables/useAuthService'
import { LocalUser, UserState } from '@/types/UserState'
import { useDataService } from '@/composables/useDataService'

type ScreenSize = 'sm' | 'md' | 'lg'

export const useAppStore = defineStore('app', () => {
  const recipeStore = useRecipeStore()
  const userStore = useUserStore()
  const shoppingListStore = useShoppingListStore()
  const authService = useAuthService()
  const dataService  = useDataService()

  const testModeOn = ref(false)
  const registrationOrSigninModal = ref('')
  const screenSize = ref<ScreenSize>('lg')

  const isTestModeOn = computed(() => testModeOn.value)
  const isRegistrationModalOpen = computed(() => registrationOrSigninModal.value.length > 0)

  function initializeApp(userData: UserState) {
    console.log('initializing App with user Data: ', userData)
    const userId = userData.uid
    userStore.setInitialUserState(userData)
    recipeStore.setInitialRecipeState(userId, userData.localUser.recipes || [])
    shoppingListStore.setListState(userId, userData.localUser.shoppingLists || [])
  }

  function turnTestModeOn() {
    try {
      authService.signIn('testmode@testmode.com', 'password')
        .then((user) => {
          return dataService.loadUserData(user.uid)
        })
        .then((returnedData) => {
          const [userStoredData, userId] = returnedData
          // const testmodeData = dummyData as LocalUser
          const localUser = {
            ...userStoredData,
            uid: userId,
          }
          const userState = { uid: userId, authorized: true, localUser }
          initializeApp(userState)

        })
    } catch (error) {
      console.log('TestMode Turn On Failed: ', error)
    }
    
    testModeOn.value = true
    // const parsedDummyData = dummyData as any //TODO Correctly type
    // console.log(parsedDummyData)
    // testModeOn.value = true
    // userStore.setTestModeOn(parsedDummyData)
    // recipeStore.setInitialRecipeState(parsedDummyData.recipeState || {})
    // shoppingListStore.setListState(parsedDummyData.shoppingListState || {})
  }

  function turnTestModeOff() {
    testModeOn.value = false
    recipeStore.resetState()
    userStore.resetState()
  }

  function toggleRegistrationModal(type?: string) {
    registrationOrSigninModal.value = ''

    setTimeout(() => {
      registrationOrSigninModal.value = type || ''
    }, 10)
  }

  function setScreenSize(updatedScreenSize: ScreenSize) {
    screenSize.value = updatedScreenSize
  }

  function resetState() {
    testModeOn.value = false
    registrationOrSigninModal.value = ''
  }

  return {
    testModeOn,
    registrationOrSigninModal,
    isTestModeOn,
    isRegistrationModalOpen,
    initializeApp,
    turnTestModeOn,
    turnTestModeOff,
    toggleRegistrationModal,
    setScreenSize,
    resetState
  }
})
