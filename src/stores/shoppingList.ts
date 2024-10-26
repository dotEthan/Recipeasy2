import { defineStore } from 'pinia'
import type { ShoppingList } from '@/types/ShoppingLists'

export const useShoppingListStore = defineStore('shopping-lists', {
  state: () => ({
    userId: '1', // UUID
    shoppingLists: [] as ShoppingList[],
    defaultListId: -1
  }),
  getters: {
    shoppingListLength: (state): number => state.shoppingLists.length
  },
  actions: {
    addShoppingList(shoppingList: ShoppingList) {
      this.$patch((state) => {
        state.shoppingLists.push(shoppingList)
      })
    }
  }
})
