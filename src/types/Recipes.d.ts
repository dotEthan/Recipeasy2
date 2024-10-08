export type Recipe = {
  id?: number
  name?: string
  rating?: number
  description?: string
  ingredients?: Ingredients[]
  imgPath?: string
  private?: boolean
  tags?: string[]
}

export type Ingredients = {
  name?: string
  amount?: string
  unit?: string
}
