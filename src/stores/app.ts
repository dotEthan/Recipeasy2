import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRecipeStore } from './recipe'

import { useUserStore } from './user'

import dummyData from '../assets/dummyData.json'
import { useShoppingListStore } from './shoppingList'

type ScreenSize = 'sm' | 'md' | 'lg'

export const useAppStore = defineStore('app', () => {
  const recipeStore = useRecipeStore()
  const userStore = useUserStore()
  const shoppingListStore = useShoppingListStore()

  const testModeOn = ref(false)
  const registrationOrSigninModal = ref('')
  const screenSize = ref<ScreenSize>('lg')

  const isTestModeOn = computed(() => testModeOn.value)
  const isRegistrationModalOpen = computed(() => registrationOrSigninModal.value.length > 0)

  function turnTestModeOn() {
    const parsedDummyData = dummyData as any //TODO Correctly type
    console.log(parsedDummyData)
    testModeOn.value = true
    userStore.setTestModeOn(parsedDummyData)
    recipeStore.setInitialRecipeState(parsedDummyData.recipeState || {})
    shoppingListStore.setListState(parsedDummyData.shoppingListState || {})
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
    turnTestModeOn,
    turnTestModeOff,
    toggleRegistrationModal,
    setScreenSize,
    resetState
  }
})
