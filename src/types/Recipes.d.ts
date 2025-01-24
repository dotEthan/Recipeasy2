
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
  resetUsedPublicIndices(): void;
  resetState(): void;
}

export type Recipe = {
  id: string
  creatorId?: string
  name?: string
  url?: string
  rating?: number
  description?: string
  ingredients: Ingredient[]
  directions: Direction[]
  imgPath?: string
  userRating?: number
  publicRating?: number
  isPrivate?: boolean
  mealType?: string[]
  tags: string[]
  cookTime?: string
  prepTime?: string
  nutritionalInfo?: NutritionalInfo[]
  isPublicRecipe?: boolean
}

export type Ingredient = {
  title?: string
  steps: IngredientStep[]
}

export type IngredientStep = {
  name?: string
  amount?: string
  unit?: string
}

export type Direction = {
  title?: string
  steps: string[]
}

export type NutritionalInfo = {
  name?: string
  amount?: string
}