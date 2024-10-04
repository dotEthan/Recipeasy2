import { defineStore } from 'pinia'

export const UseAppStore = defineStore('app', {
  state: () => ({
    testModeOn: false
  }),
  getters: {
    isTestModeOn: (state) => state.testModeOn
  },
  actions: {
    turnTestModeOn() {
      this.testModeOn = true
    },
    turnTestModeOff() {
      this.testModeOn = false
    }
  }
})
