import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { defineStore } from 'pinia'
import type { ShoppingList, ShoppingListState } from '@/types/ShoppingLists'

export const useShoppingListStore = defineStore('shopping-lists', () => {
  const uid = ref('')
  const shoppingLists = ref<ShoppingList[]>([
    { id: '007', items: ['potates', 'lotion', 'lots of lotion'], title: 'Stuff', isDefault: true }
  ])
  const defaultListId = ref(shoppingLists.value.find((list) => list.isDefault)?.id || '')
  const viewableShoppingListIds = ref(['107'])
  const wantedViewableListLength = ref(4)

  const getAllLists = computed(() => shoppingLists)
  const getDefaultId = computed(() => defaultListId)

  function setListState(state: ShoppingListState) {
    console.log()
    uid.value = state.uid
    shoppingLists.value = state.shoppingLists
    viewableShoppingListIds.value = state.viewableShoppingListIds
    defaultListId.value = state.defaultListId
  }

  function addList() {
    const newList = { id: uuidv4(), isDefault: false, items: [] } as ShoppingList
    shoppingLists.value.push(newList)
  }

  function deleteList(index: number) {
    shoppingLists.value.splice(index, 1)
  }

  function setDefaultList(newDefaultId: string) {
    defaultListId.value = newDefaultId
    console.log(newDefaultId)
    shoppingLists.value.forEach((list) =>
      list.id === newDefaultId ? list.isDefault === true : (list.isDefault = false)
    )
  }

  function updateWantedViewableLength(screensize: string) {
    if (screensize === 'sm') {
      wantedViewableListLength.value = 1
    } else if (screensize === 'md') {
      wantedViewableListLength.value = 2
    } else {
      wantedViewableListLength.value = 4
    }
    console.log('screensize changed, list size now: ', wantedViewableListLength.value)
  }

  // addListToViewable() {

  // }

  // removeListFromViewable() {

  // }

  function resetListState() {
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
    getAllLists,
    getDefaultId,
    setListState,
    addList,
    deleteList,
    setDefaultList,
    updateWantedViewableLength,
    resetListState
  }
})
