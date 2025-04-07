import { ObjectId } from "bson";

export type ShoppingListState = {
  shoppingLists: ShoppingList[];
  viewableShoppingListIds: string[];
  defaultListId: string;
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
