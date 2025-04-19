import { ObjectId } from "bson";

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
  creator: ObjectId;
  viewableBy: ObjectId[];
}

export type CachedShoppingListState = {
  shoppingLists: ShoppingList[];
  expiresAt: number;
}