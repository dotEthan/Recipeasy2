export type Recipe = {
  id?: number
  name?: string
  rating?: number
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
