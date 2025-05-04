import type { Recipe } from '@/types/Recipes'
import type { ShoppingList } from './ShoppingLists'

export type UserState = {
  localUser: LocalUser;
  authorized: boolean | null;
}
export type CachedUserState = UserState & { expiresAt: number }

export type LocalUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  recipes?: UserRecipes[];
  email?: string;
  createdAt?: date;
  shoppingLists?: ShoppingList[];
  preferences? : UserPreferences;
  verified: boolean;
  ratings?: UserRatings;
}

export type UserPreferences = {
  personalFilters?: string[];
  lightMode?: boolean;
}

export type UserRatings = {
  recipeId: string;
  rating: number;
  timestamp: date;
}

export type UserRecipes = {
  id: string;
  alterations?: Partial<Recipe>;
}