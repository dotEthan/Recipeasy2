import type { Recipe } from '@/types/Recipes'
import type { ShoppingList } from './ShoppingLists'
import { ObjectId } from 'bson'

export type UserState = {
  localUser: LocalUser;
  authorized: boolean | null;
}
export type CachedUserState = UserState & { expiresAt: number }

export type LocalUser = {
  _id: ObjectId;
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
  recipeId: ObjectId;
  rating: number;
  timestamp: date;
}

export type UserRecipes = {
  _id: ObjectId;
  alterations?: Partial<Recipe>;
}