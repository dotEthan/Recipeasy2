import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRecipeStore } from './recipe'
import { auth } from '../firebase'
import { collection, getFirestore } from 'firebase/firestore'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { useUserStore } from './user'
import { useDataService } from '@/composables/useDataService'
import type { LocalUser } from '@/types/UserState'

export const useAppStore = defineStore('app', () => {
  const recipeStore = useRecipeStore()
  const userStore = useUserStore()
  const dataService = useDataService()
  const db = getFirestore()
  const testDataRef = collection(db, 'test_data')

  const testModeOn = ref(false)
  const registrationOrSigninModal = ref('')

  const isTestModeOn = computed(() => testModeOn.value)
  const isRegistrationModalOpen = computed(() => registrationOrSigninModal.value.length > 0)

  async function turnTestModeOn() {
    try {
      await signInWithEmailAndPassword(auth, 'testmode@testmode.com', 'testmode')
      testModeOn.value = true

      // const userStoredData = (await dataService.loadUserData('testmode', testDataRef)) as LocalUser

      const userStoredData = {
        uid: '007',
        recipes: [],
        shoppingLists: [
          { id: '007', isDefault: true, title: 'groceries', items: ['potates', 'mylk', 'buefy'] }
        ]
      } as LocalUser
      userStore.setTestModeOn(userStoredData)
      recipeStore.setAllRecipes(userStoredData.recipes || [])
    } catch (error: any) {
      console.log('Error during registration:', error)
    }
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
    resetState
  }
})
