import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ShoppingList, ShoppingListState } from '@/types/ShoppingLists'

export const useShoppingListStore = defineStore('shopping-lists', () => {
  const uid = ref('')
  const shoppingLists = ref<ShoppingList[]>([
    { id: '007', items: ['potates', 'lotion', 'lots of lotion'], title: 'Stuff', isDefault: true }
  ])
  const defaultListId = ref('')
  const viewableShoppingListIds = ref<string[]>(['007'])
  const wantedViewableListLength = ref(4) //TODO connect to screen resize

  const getAllShoppingLists = computed(() => shoppingLists)

  function setShoppingListState(state: ShoppingListState) {
    uid.value = state.uid
    shoppingLists.value = state.shoppingLists
    viewableShoppingListIds.value = state.viewableShoppingListIds
    defaultListId.value = state.defaultListId
  }

  function addShoppingList(shoppingList: ShoppingList) {
    shoppingLists.value.push(shoppingList)
  }

  function removeShoppingList(id: string) {
    shoppingLists.value.map((list) => list.id !== id)
  }

  function resetShoppingListState() {
    uid.value = ''
    shoppingLists.value = []
    viewableShoppingListIds.value = []
    defaultListId.value = ''
  }

  return {
    uid,
    shoppingLists,
    defaultListId,
    viewableShoppingListIds,
    wantedViewableListLength,
    getAllShoppingLists,
    setShoppingListState,
    addShoppingList,
    removeShoppingList,
    resetShoppingListState
  }
})
