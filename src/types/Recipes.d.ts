export type Recipe = {
  id?: number
  title?: string
  rating?: number
  ingredients?: Ingredients[]
  imgUrl?: string
  private?: boolean
  tags?: string[]
}

export type Ingredients = {
  name?: string
  amount?: string
  unit?: string
}
