import { computed, ref } from 'vue'
import { ObjectId } from 'bson'
import { v4 as uuidv4 } from 'uuid'
import { defineStore } from 'pinia'

import type { ShoppingList } from '@/types/ShoppingLists'
import { useUserStore } from './user'
import { setSessionData } from '@/utilities'
import { CACHED_DATA_TTL } from '@/constants'

/**
 * Store for all Shopping list Related Data
 * @todo Update Mock Store and Apply store types
 * @returns {Object} -  shoppingLists, editingListIndex, editingItemIndex, setInitialListState, setEditingListIndex, setEditingItemIndex, getItemValue, addNewList, addToDefaultList, deleteList, setDefaultList, deleteListItem, hydrateStore, cacheListState, resetState
 */
export const useShoppingListStore = defineStore('shopping-lists', () => {
  const userStore = useUserStore();

  // Variables
  const shoppingLists = ref<ShoppingList[]>([]);
  const editingListIndex = ref(-1);
  const editingItemIndex = ref(-1);

  // Computed
  const defaultList = computed((): ShoppingList | undefined => {
    return shoppingLists.value.filter((sl) => sl.isDefault )[0];
  })

  // Functions
  function setInitialListState(lists: ShoppingList[]) {
    shoppingLists.value = lists;
  }

  function getItemValue(listIndex: number, itemIndex: number) {
    return shoppingLists.value[listIndex].items[itemIndex]
  }

  function addNewList(isDefault = false) {
    const listTitle = 'New List #' + shoppingLists.value.length
    const newList = {
      id: uuidv4(),
      title: listTitle,
      isDefault: isDefault,
      items: [],
      isOpen: true,
      creator: userStore.getCurrentUserId,
      viewableBy: [userStore.getCurrentUserId],
    } as ShoppingList
    shoppingLists.value.push(newList)
  }

  function addToDefaultList(items: string[]) {
    if(shoppingLists.value.length === 0) addNewList(true);

    defaultList.value?.items.push(...items)
  }

  function deleteList(index: number) {
    console.log('deleting index: ', index)
    console.log('dleteing list: ', shoppingLists.value[index])
    if (index >= 0 && index < shoppingLists.value.length) {
      shoppingLists.value.splice(index, 1)
    }
  }

  function setDefaultList(newDefaultId: string) {
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

  function hydrateStore(cachedShoppingLists: ShoppingList[]) {
    shoppingLists.value = cachedShoppingLists;
  }

  function cacheListState() {
    setSessionData('shoppingLists', {
      list: shoppingLists.value,
      expiresAt: new Date().getTime() + (CACHED_DATA_TTL)
    });
  }

  function resetState() {
    shoppingLists.value = []
  }

  return {
    shoppingLists,
    editingListIndex,
    editingItemIndex,
    setInitialListState,
    setEditingListIndex,
    setEditingItemIndex,
    getItemValue,
    addNewList,
    addToDefaultList,
    deleteList,
    setDefaultList,
    deleteListItem,
    hydrateStore,
    cacheListState,
    resetState
  }
})
