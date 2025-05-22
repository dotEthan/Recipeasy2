import { ComputedRef, Ref } from "vue";

export interface ShoppingListStore {
  shoppingLists: Ref<ShoppingList[]>;
  editingListIndex: Ref<number>;
  editingItemIndex: Ref<number>;

  defaultList: ComputedRef<ShoppingList | undefined>;

  setInitialListState(lists: ShoppingList[]): void;
  getItemValue(listIndex: number, itemIndex: number): string;
  addNewList(isDefault?: boolean): void;
  addToDefaultList(items: string[]): void;
  deleteList(index: number): void;
  setDefaultList(newDefaultId: string): void;
  setEditingListIndex(i: number): void;
  setEditingItemIndex(i: number): void;
  deleteListItem(listIndex: number, itemIndex: number): void;
  hydrateStore(cachedLists: ShoppingList[]): void;
  resetState(): void;
}

export type ShoppingListState = {
  shoppingLists: ShoppingList[];
  editingListIndex: number;
  editingItemIndex: number;
};

export type ShoppingList = {
  id: string;
  title?: string;
  items: string[];
  isDefault: boolean;
  isOpen: boolean;
  creator: string;
  viewableBy?: string[];
};

export type CachedShoppingListState = {
  shoppingLists: ShoppingList[];
  expiresAt: number;
};
