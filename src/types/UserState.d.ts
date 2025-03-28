import type { Recipe } from '@/types/Recipes'
import type { ShoppingList } from './ShoppingLists'

export type UserState = {
  _id: string
  localUser: LocalUser
  authorized: boolean | null
}

export type LocalUser = {
  _id: string
  firstName?: string
  lastName?: string
  displayName?: string
  recipes?: Recipe[]
  email?: string
  createdAt?: date
  shoppingLists?: ShoppingList[]
  preferences? : UserPreferences
}

export type UserPreferences = {
  personalFilters?: string[]
  lightMode?: boolean
}