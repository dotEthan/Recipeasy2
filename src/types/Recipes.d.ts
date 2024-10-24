export type Recipe = {
  id?: number
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
  steps: IngredientSteps[]
}

export type IngredientSteps = {
  name?: string
  amount?: string
  unit?: string
}

export type Direction = {
  title?: string
  steps: string[]
}
