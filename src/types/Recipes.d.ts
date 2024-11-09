export type RecipeState = {
  userId: string
  recipes?: Recipe[]
  allTags?: string[]
  selectedRecipeId?: string
  activeFilters?: string[]
}

export type Recipe = {
  id?: string
  name?: string
  rating?: number
  description?: string
  ingredients: Ingredient[]
  directions: Direction[]
  imgPath?: string
  url?: string
  private?: boolean
  tags: string[]
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
