import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { defineStore } from 'pinia'
import type { ShoppingList } from '@/types/ShoppingLists'

export const useShoppingListStore = defineStore('shopping-lists', () => {
  const uid = ref('')
  const shoppingLists = ref<ShoppingList[]>([])
  const defaultListId = ref('')
  const editingListIndex = ref(-1)
  const editingItemIndex = ref(-1)

  function setListState(userId: string, lists: ShoppingList[]) {
    uid.value = userId
    shoppingLists.value = lists
    defaultListId.value = shoppingLists?.value?.find((list) => list.isDefault)?.id || ''
  }

  function getItemValue(listIndex: number, itemIndex: number) {
    return shoppingLists.value[listIndex].items[itemIndex]
  }

  function addNewList() {
    const listTitle = 'New List #' + shoppingLists.value.length
    const newList = {
      id: uuidv4(),
      title: listTitle,
      isDefault: false,
      items: [],
      isOpen: true
    } as ShoppingList
    shoppingLists.value.push(newList)
  }

  function addToDefaultList(items: string[]) {
    const defaultList = shoppingLists.value.find((list) => list.id === defaultListId.value)

    if (defaultList) {
      defaultList.items.push(...items)
    } else {
      console.error('Default shopping list not found')
    }
  }

  function deleteList(index: number) {
    console.log('deleting index: ', index)
    console.log('dleteing list: ', shoppingLists.value[index])
    if (index >= 0 && index < shoppingLists.value.length) {
      shoppingLists.value.splice(index, 1)
    }
  }

  function setDefaultList(newDefaultId: string) {
    defaultListId.value = newDefaultId
    console.log(newDefaultId)
    shoppingLists.value.forEach((list) =>
      list.id === newDefaultId ? list.isDefault === true : (list.isDefault = false)
    )
  }

  function setEditingListIndex(i: number) {
    editingListIndex.value = i
  }

  function setEditingItemIndex(i: number) {
    editingItemIndex.value = i
  }

  function deleteListItem(listIndex: number, itemIndex: number) {
    console.log('listIndex: ', listIndex)
    console.log('itemIndex: ', itemIndex)
    if (listIndex >= 0 && itemIndex >= 0) shoppingLists.value[listIndex].items.splice(itemIndex, 1)
  }

  function resetState() {
    uid.value = ''
    shoppingLists.value = []
    defaultListId.value = ''
  }

  return {
    uid,
    shoppingLists,
    defaultListId,
    editingListIndex,
    editingItemIndex,
    setListState,
    setEditingListIndex,
    setEditingItemIndex,
    getItemValue,
    addNewList,
    addToDefaultList,
    deleteList,
    setDefaultList,
    deleteListItem,
    resetState
  }
})
