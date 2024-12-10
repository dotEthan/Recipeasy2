export type RecipeState = {
  userId: string
  recipes?: Recipe[]
  publicRecipes?: Recipe[]
  allTags?: string[]
  selectedRecipeId?: string
  personalFilters?: string[]
}

export type Recipe = {
  id?: string
  createdBy?: string
  name?: string
  url?: string
  rating?: number
  description?: string
  ingredients: Ingredient[]
  directions: Direction[]
  imgPath?: string
  rating?: number
  private?: boolean
  mealType?: string[]
  tags: string[]
  cookTime?: string
  prepTime?: string
  nutritionalInfo?: NutritionalInfo[]
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