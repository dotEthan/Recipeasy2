export type ShoppingListState = {
  uid: string
  shoppingLists: ShoppingList[]
  viewableShoppingListIds: string[]
  defaultListId: string
}

export type ShoppingList = {
  id: string
  title?: string
  items?: string[]
  isDefault: boolean
}
