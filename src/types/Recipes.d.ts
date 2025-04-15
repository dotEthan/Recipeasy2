import { ObjectId } from "bson";
import { DurationUnits, Visibility } from "./RecipesEnums";

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
  selectedRecipe(): Ref<Recipe>;
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

export type NewRecipe = Omit<Recipe, '_id'>;

export type Recipe = {
  _id: ObjectId;
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
  userId: ObjectId;
  copyDetails?: CopyDetails
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

export type CopyDetails = {
  originalCreatorId?: ObjectId,
  originalRecipeId?: ObjectId,
  copiedAt?: Date,
  modifications?: boolean
}