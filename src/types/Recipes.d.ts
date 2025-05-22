import { ComputedRef, Ref } from "vue";

export enum Visibility {
  Public = "public",
  Private = "private"
}

export enum DurationUnits {
  Minutes = "minutes",
  Hours = "hours",
  Days = "days"
}

export interface RecipeStore {
  recipes: Ref<Recipe[]>;
  publicRecipes: Ref<Recipe[]>;
  allTags: Ref<string[]>;
  ethansFavouritePublicIds: Ref<string[]>;
  selectedRecipeId: Ref<string | undefined>;
  editSelectedRecipe: Ref<boolean>;
  tempRecipeDeleteArray: Ref<Recipe[]>;
  tempRecipeSaveArray: Ref<Recipe[]>;

  getAllUserRecipes: ComputedRef<Recipe[]>;
  selectedRecipe: ComputedRef<Recipe | undefined>;
  isSelectedRecipePublic: ComputedRef<boolean>;
  isSelectedRecipeInLocalUsersRecipes: ComputedRef<boolean>;
  isSelectedRecipeLocalUsers: ComputedRef<boolean>;
  personalFilters: ComputedRef<string[]>;
  recipesLength: ComputedRef<number>;
  publicRecipesLength: ComputedRef<number>;
  getAllRecipeTags: ComputedRef<string[]>;

  useFilteredRecipes(activeFilters: string[]): Ref<Recipe[]>;
  setInitialPublicRecipeState(publicRecipeData: Recipe[]): void;
  setInitialUserRecipeState(userRecipeData: Recipe[]): void;
  generatePublicRecipeCollections(): Ref<Recipe[]>[];
  updatePublicRecipe(recipe: Recipe): void;
  getRecipeById(id: string): void;
  updateRecipe(recipe: Recipe): void;
  addRecipe(recipe: Recipe): void;
  setSelectedRecipeId(id: string): void;
  setEditStatusSelectedId(status: boolean): void;
  backupNewRecipeDataForSave(recipe: Recipe): void;
  prepareRecipeDeletion(id: string): void;
  finishRecipeDeletion(): void;
  revertRecipeDeletion(id: string): void;
  removeRecipeById(id: string): void;
  prepRecipeDataForUpdate(recipe: Recipe): void;
  finishSuccessfulSave(udpatedRecipe: Recipe): void;
  revertFailedSave(recipeToRevert: Recipe): void;
  finishSuccessfulUpdate(updatedRecipe: Recipe): void;
  revertFailedUpdate(recipeToRevert: Recipe): void;
  clearSelectedRecipeId(): void;
  hydrateStore(RecipeState: RecipeState): void;
  resetState(): void;
  resetUserRecipeState(): void;
}

export type NewRecipe = Omit<Recipe, "_id">;

export type CachedRecipeState = RecipeState & { expiresAt: number };

export type RecipeState = {
  recipes: Recipe[];
  publicRecipes: Recipe[];
  allTags: string[];
  selectedRecipeId?: string;
  editSelectedRecipe: boolean;
};

export type Recipe = {
  _id: string;
  name: string;
  description: string;
  imgPath: string;
  info: RecipeInfo;
  ratings: RecipeRatings;
  url: string;
  ingredients: Ingredient[];
  directions: Direction[];
  visibility: Visibility;
  tags: string[];
  notes: string[];
  userId: string;
};

export type RecipeInfo = {
  mealType?: string[];
  cuisineType?: string;
  cookTime?: Duration;
  prepTime?: Duration;
  servingSize?: number;
  nutritionalInfo?: NutritionalInfo[];
};

type Duration = {
  value?: number;
  unit?: DurationUnits;
};

export type Ingredient = {
  title?: string;
  steps: IngredientStep[];
};

export type IngredientStep = {
  name?: string;
  amount?: string;
  unit?: string;
  process?: string;
};

export type Direction = {
  title?: string;
  steps: string[];
};

export type NutritionalInfo = {
  name?: string;
  amount?: string;
};

export type RecipeRatings = {
  ratings: RatingItem[];
  averageRating: number;
  totalRatings: number;
  ratingsSum: number;
};

export type RatingItem = {
  userId?: string;
  rating?: number;
  timestamp?: Date;
};
