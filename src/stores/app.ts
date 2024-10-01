import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    testModeOn: false,
    authorized: false
  }),
  getters: {
    isTestModeOn: (state) => state.testModeOn,
    isAuthorized: (state) => state.authorized
  },
  actions: {
    turnTestModeOn() {
      this.testModeOn = true
    },
    turnTestModeOff() {
      this.testModeOn = false
    },
    deauthorize() {
      this.authorized = false
    },
    authorize() {
      this.authorized = true
    }
  }
})
