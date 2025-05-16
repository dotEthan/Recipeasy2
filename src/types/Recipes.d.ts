import { DurationUnits, Visibility } from "./RecipesEnums";

export interface RecipeStore {
  recipes?: Ref<Recipe[]>;
  existingPublicRecipes?: Ref<Recipe[]>;
  allTags?: Ref<Recipe[]>;
  ethansFavouritePublicIds: Ref<string>;
  selectedRecipeId: Ref<string>;
  existingPublicRecipes: Ref<Recipe[]>;
  editSelectedRecipe: Ref<boolean>;
  tempRecipeDeleteArray: Ref<Recipe[]>;
  tempRecipeSaveArray: Ref<Recipe[]>;
  selectedRecipe(): Ref<Recipe>;
  isSelectedRecipePublic(): Ref<boolean>;
  isSelectedRecipeLocalUsers(): Ref<boolean>;
  personalFilters(): Ref<string[]>;
  recipesLength(): Ref<number>;
  existingPublicRecipesLength(): Ref<number>;
  getAllRecipeTags(): Ref<string[]>
  useFilteredRecipes(activeFilters: string[]): Ref<Recipe[]>;
  setInitialRecipeState(userData: UserState, publicRecipeData: Recipe[]): void;
  getNRandomPublicRecipes(numberOfRecipes: number): Ref<Recipe[]>;
  updateRecipe(recipe: Recipe): void;
  addRecipe(recipe: Recipe): void;
  setSelectedRecipeId(id: string): void;
  setEditStatusSelectedId(status: boolean): void;
  removeRecipeById(id: string):void
  resetNewPublicRecipes(): void;
  resetRemovedPublicRecipes(): void;
  resetState(): void;
}

export type NewRecipe = Omit<Recipe, '_id'>;

export type CachedRecipeState = RecipeState & { expiresAt: number };

export type RecipeState = {
  recipes: Recipe[];
  existingPublicRecipes: Recipe[];
  allTags: string[];
  selectedRecipeId?: string;
  editSelectedRecipe: boolean;
}

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
}

export type RecipeInfo = {
  mealType?: string[];
  cuisineType?: string;
  cookTime?: Duration;
  prepTime?: Duration;
  servingSize?: number;
  nutritionalInfo?: NutritionalInfo[];
}

type Duration = {
  value?: number;
  unit?: DurationUnits;
};

export type Ingredient = {
  title?: string;
  steps: IngredientStep[];
}

export type IngredientStep = {
  name?: string;
  amount?: string;
  unit?: string;
  process?: string
}

export type Direction = {
  title?: string;
  steps: string[];
}

export type NutritionalInfo = {
  name?: string;
  amount?: string;
}

export type RecipeRatings = { 
  ratings: RatingItem[];
  averageRating: number;
  totalRatings: number;
  ratingsSum: number;
}

export type RatingItem = {
  userId?: string; 
  rating?: number; 
  timestamp?: Date; 
}
