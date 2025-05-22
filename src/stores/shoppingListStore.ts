import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

import { computed, ref, watch } from "vue";

import { useUserStore } from "@/stores/userStore";
import type { ShoppingList, ShoppingListStore } from "@/types/ShoppingLists.d";
import { formatCachedValue } from "@/utilities";

/**
 * Store for all Shopping list Related Data
 * @todo Update Mock Store and Apply store types
 * @todo Make sure still working
 */
export const useShoppingListStore = defineStore("shopping-lists", (): ShoppingListStore => {
  const userStore = useUserStore();

  // Variables
  const shoppingLists = ref<ShoppingList[]>([]);
  const editingListIndex = ref<number>(-1);
  const editingItemIndex = ref<number>(-1);

  // Watchers
  watch(
    () => shoppingLists.value,
    (newShoppingLists: ShoppingList[]) => {
      sessionStorage.setItem("shoppingLists", formatCachedValue(newShoppingLists));
    },
    { deep: true }
  );

  // Computed
  const defaultList = computed((): ShoppingList | undefined => {
    return shoppingLists.value.filter((sl) => sl.isDefault)[0];
  });

  // Functions
  function setInitialListState(lists: ShoppingList[]) {
    shoppingLists.value = lists;
  }

  function getItemValue(listIndex: number, itemIndex: number): string {
    return shoppingLists.value[listIndex].items[itemIndex];
  }

  function addNewList(isDefault: boolean = false) {
    const listTitle = "New List #" + shoppingLists.value.length;
    const newList = {
      id: uuidv4(),
      title: listTitle,
      isDefault: isDefault,
      items: [],
      isOpen: true,
      creator: userStore.getCurrentUserId,
      viewableBy: [userStore.getCurrentUserId]
    } as ShoppingList;
    shoppingLists.value.push(newList);
  }

  function addToDefaultList(items: string[]) {
    if (shoppingLists.value.length === 0) addNewList(true);

    defaultList.value?.items.push(...items);
  }

  function deleteList(index: number) {
    if (index >= 0 && index < shoppingLists.value.length) {
      shoppingLists.value.splice(index, 1);
    }
  }

  function setDefaultList(newDefaultId: string) {
    shoppingLists.value.forEach((list) =>
      list.id === newDefaultId ? list.isDefault === true : (list.isDefault = false)
    );
  }

  function setEditingListIndex(i: number) {
    editingListIndex.value = i;
  }

  function setEditingItemIndex(i: number) {
    editingItemIndex.value = i;
  }

  function deleteListItem(listIndex: number, itemIndex: number) {
    if (listIndex >= 0 && itemIndex >= 0) shoppingLists.value[listIndex].items.splice(itemIndex, 1);
  }

  function hydrateStore(cachedLists: ShoppingList[]) {
    shoppingLists.value = cachedLists;
  }

  function resetState() {
    shoppingLists.value = [];
  }

  return {
    shoppingLists,
    editingListIndex,
    editingItemIndex,
    defaultList,
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
    resetState
  };
});
