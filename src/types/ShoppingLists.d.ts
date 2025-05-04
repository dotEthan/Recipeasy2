export type ShoppingListState = {
  shoppingLists: ShoppingList[];
  editingListIndex: number;
  editingItemIndex: number;
}

export type ShoppingList = {
  id: string;
  title?: string;
  items: string[];
  isDefault: boolean;
  isOpen: boolean;
  creator: string;
  viewableBy: string[];
}

export type CachedShoppingListState = {
  shoppingLists: ShoppingList[];
  expiresAt: number;
}