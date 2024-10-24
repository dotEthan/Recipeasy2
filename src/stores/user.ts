import type { UserState } from '@/types/UserState'
import { defineStore } from 'pinia'

export const UseUserStore = defineStore('user', {
  state: (): UserState => ({
    uid: '',
    authorized: false,
    allTags: [],
    localUser: {}
  }),
  getters: {
    isAuthorized: (state) => state.authorized,
    getCurrentUser: (state) => state.localUser
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
    },
    setAuthorizedUser(user: UserState) {
      this.$patch(user)
    },
    resetState() {
      this.$patch({
        uid: '',
        authorized: false,
        allTags: [],
        localUser: {}
      })
    }
  }
})
