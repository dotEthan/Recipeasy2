import { ComputedRef, Ref } from "vue";

import type { Recipe } from "./Recipes.d";
import type { ShoppingList } from "./ShoppingLists.d";

export interface UserStore {
  authorized: Ref<boolean | null>;
  localUser?: Ref<LocalUser | undefined>;

  isAuthorized: ComputedRef<boolean | null>;
  isUserVerified: ComputedRef<boolean | undefined>;
  getCurrentUser: ComputedRef<LocalUser | undefined>;
  getCurrentUserId: ComputedRef<string | undefined>;
  getCurrentUserEmail: ComputedRef<string | undefined>;
  getUserPersonalPreferences: ComputedRef<string[] | undefined>;

  deauthorize(): void;
  authorize(): void;
  setLocalUser(user: LocalUser): void;
  setInitialUserState(userState: UserState): void;
  verifyUser(): void;
  addIdToLocalUserRecipes(recipeId: string): void;
  removeIdFromLocalUserRecipes(recipeId: string): void;
  hydratestore(userState: UserState): void;
  resetState(): void;
}

export type UserState = {
  localUser: LocalUser;
  authorized: boolean | null;
};
export type CachedUserState = UserStore & { expiresAt: number };

export type LocalUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  recipes?: UserRecipes[];
  email?: string;
  createdAt?: date;
  shoppingLists?: ShoppingList[];
  preferences?: UserPreferences;
  verified: boolean;
  ratings?: UserRatings;
};

export type UserPreferences = {
  personalFilters?: string[];
  lightMode?: boolean;
};

export type UserRatings = {
  recipeId: string;
  rating: number;
  timestamp: date;
};

export type UserRecipes = {
  id: string;
  alterations?: Partial<Recipe>;
};
