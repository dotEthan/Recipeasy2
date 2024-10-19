import { defineStore } from 'pinia'

export const UseAppStore = defineStore('app', {
  state: () => ({
    testModeOn: false,
    registrationModalOpen: false
  }),
  getters: {
    isTestModeOn: (state) => state.testModeOn,
    isRegistrationModalOpen: (state) => state.registrationModalOpen
  },
  actions: {
    turnTestModeOn() {
      this.testModeOn = true
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
