
export interface RecipeStore {
  userId: Ref<string>;
  recipes?: Ref<Recipe[]>;
  publicRecipes?: Ref<Recipe[]>;
  allTags?: Ref<Recipe[]>;
  selectedRecipeId: Ref<string>;
  personalFilters: Ref<string[]>;
  existingPublicRecipes: Ref<Recipe[]>;
  newPublicRecipes: Ref<Recipe[]>;
  removedPublicRecipes: Ref<Recipe[]>;
  allTags: Ref<string[]>;
  usedPublicRecipeIndices: Ref<number[]>;
  selectedRecipeId: Ref<string>;
  isSelectedRecipePublic: Ref<boolean>;
  editSelectedRecipe: Ref<boolean>;
  personalFilters(): Ref<string[]>;
  recipesLength(): Ref<number>;
  existingPublicRecipesLength(): Ref<number>;
  getSelectedRecipe(): Ref<Recipe>;
  getAllRecipeTags(): Ref<string[]>
  useFilteredRecipes(activeFilters: string[]): Ref<Recipe[]>;
  setInitialRecipeState(userData: UserState, publicRecipeData: Recipe[]): void;
  getNRandomPublicRecipes(numberOfRecipes: number): Ref<Recipe[]>;
  updateRecipe(recipe: Recipe): void;
  addRecipe(recipe: Recipe): void;
  setSelectedRecipeId(id: string): void;
  setEditStatusSelectedId(status: boolean): void;
  removeRecipeById(id: string):void
  addToPublicRecipes(newPublicRecipe: Recipe): void,
  removeFromPublicRecipes(id: string): void,
  resetNewPublicRecipes(): void;
  resetRemovedPublicRecipes(): void;
  resetState(): void;
}

export type Recipe = {
  _id: string;
  creatorId: string;
  name: string;
  url?: string;
  description?: string;
  ingredients: Ingredient[];
  directions: Direction[];
  imgPath?: string;
  ratings?: RecipeRatings[];
  isPrivate: boolean;
  mealType?: string[];
  cuisineType?: string;
  tags: string[];
  cookTime?: string;
  prepTime?: string;
  servingSize?: string;
  nutritionalInfo: NutritionalInfo[];
  isPublicRecipe?: boolean;
  notes: string[];
}

export type Ingredient = {
  title?: string;
  steps: IngredientStep[];
}

export type IngredientStep = {
  name?: string;
  amount?: string;
  unit?: string;
}

export type Direction = {
  title?: string;
  steps: string[];
}

export type NutritionalInfo = {
  type?: string;
  amount?: string;
}

export type RecipeRatings = { 
  ratings: RatingItem[];
  averageRating: number;
  totalRatings: number;
  ratingsSum: number;
}

export type RatingItem = {
  userId: string; 
  rating: number; 
  timestamp: Date; 
}