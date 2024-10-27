import type { Recipe } from '@/types/Recipes'
import type { ShoppingList } from './ShoppingLists'

export type UserState = {
  uid: string
  localUser: LocalUser
  authorized: boolean
}

export type LocalUser = {
  uid?: string
  firstName?: string
  lastName?: string
  displayName?: string
  recipes?: Recipe[]
  email?: string
  createdAt?: date
  shoppingLists?: ShoppingList[]
}
