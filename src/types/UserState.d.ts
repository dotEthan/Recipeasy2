import type { Recipe } from '@/types/Recipes'

export type UserState = {
  uid: string
  localUser?: LocalUser
  authorized: boolean
  allTags: string[]
}

export type LocalUser = {
  uid?: string
  firstName?: string
  lastName?: string
  displayName?: string
  recipes?: Recipe[]
  email?: string
}
