import { defineStore } from 'pinia'
import { useRecipeStore } from './recipe'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export const useAppStore = defineStore('app', {
  state: () => ({
    testModeOn: false,
    registrationModalOpen: false
  }),
  getters: {
    isTestModeOn: (state) => state.testModeOn,
    isRegistrationModalOpen: (state) => state.registrationModalOpen
  },
  actions: {
    async turnTestModeOn() {
      console.log('tests')
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          'testmode@testmode.com',
          'testmode'
        )
        const user = userCredential.user
        console.log('test User Logged in: ', user)
        const recipeStore = useRecipeStore()
        this.testModeOn = true
        recipeStore.loadDummyData()
      } catch (error: any) {
        //TODO: handle errors
        console.log('Error during registration:', error)
      }
    },
    turnTestModeOff() {
      this.testModeOn = false
    },
    toggleRegistrationModal() {
      this.registrationModalOpen = !this.registrationModalOpen
      console.log('toggling: ', this.registrationModalOpen)
    }
  }
})
