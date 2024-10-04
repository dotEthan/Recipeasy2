import { defineStore } from 'pinia'

export const UseUserStore = defineStore('user', {
  state: () => ({
    uuid: '01234',
    authorized: false,
    allTags: ['vegan', 'breakfast', 'snack', 'fast food', 'burger'] as string[]
  }),
  getters: {
    isAuthorized: (state) => state.authorized
  },
  actions: {
    deauthorize() {
      this.authorized = false
    },
    authorize() {
      this.authorized = true
    },
    addTag(tag: string) {
      this.allTags.push(tag)
    },
    removeTag(tag: string) {
      const tagIndex = this.allTags.indexOf(tag)
      this.allTags.splice(tagIndex, 1)
    }
  }
})
