import { defineStore } from 'pinia'
import { ref, computed, ComputedRef } from 'vue'
import { useUserStore } from './user'
import type { Recipe } from '@/types/Recipes'
import { UserState } from '@/types/UserState'

export const useRecipeStore = defineStore('recipes', () => {
  const userStore = useUserStore()
  const userId = ref<string>('')
  const recipes = ref<Recipe[]>([])
  const existingPublicRecipes = ref<Recipe[]>([])
  const newPublicRecipes = ref<Recipe[]>([])
  const removedPublicRecipes = ref<Recipe[]>([])
  const allTags = ref<string[]>([])

  const selectedRecipeId = ref<string>('')
  const isSelectedRecipePublic = ref(false)
  const editSelectedRecipe = ref(false)

  const personalFilters = computed(() => userStore.localUser.personalFilters || [])
  const recipesLength = computed(() => recipes.value.length)
  const getSelectedRecipe = computed(() =>
    recipes.value.find((recipe) => recipe.id === selectedRecipeId.value)
  )
  const getAllRecipeTags = computed(() =>
    Array.from(
      new Set(
        recipes.value.flatMap(
          (recipe) => recipe.tags?.filter((tag): tag is string => typeof tag === 'string') || []
        )
      )
    )
  )

  function useFilteredRecipes(activeFilters: string[]): ComputedRef<Recipe[]> {
    const allFilters = new Set([...personalFilters.value, ...activeFilters])
    return computed(() => {
      if (allFilters.size === 0) return recipes.value
      return recipes.value.filter((recipe) => {
        return recipe.tags.some((tag) => allFilters.has(tag))
      })
    })
  }

  function setInitialRecipeState(userData: UserState, publicRecipeData: Recipe[]) {
    userId.value = userData.uid
    recipes.value = userData.localUser.recipes || []
    existingPublicRecipes.value = publicRecipeData || []
    newPublicRecipes.value = []
    removedPublicRecipes.value = []
    // allTags.value = state.allTags || []
    selectedRecipeId.value = ''
    isSelectedRecipePublic.value = false
  }

  function getNRandomRecipes(num: number): Recipe[] {
    const randomRecipes: Recipe[] = []
    const length = recipesLength.value
    
    if (num > length) {
      num = length
    }
  
    const indices = new Set<number>()
  
    while (indices.size < num) {
      const randomIndex = Math.floor(Math.random() * length)
      indices.add(randomIndex)
    }
  
    indices.forEach(index => {
      randomRecipes.push(recipes.value[index])
    })
  
    return randomRecipes
  }

  function updateRecipe(recipe: Recipe) {
    console.log('updating recipe: ', recipe)
    recipes.value = recipes.value.map((r) => (r.id === recipe.id ? recipe : r))
  }

  function addRecipe(recipe: Recipe) {
    console.log('adding recipe')
    recipes.value.push(recipe)
  }

  function setSelectedRecipeId(id: string) {
    selectedRecipeId.value = id
    isSelectedRecipePublic.value = /^pub--/.test(id);
  }

  function setEditStatusSelectedId(status: boolean) {
    editSelectedRecipe.value = status
  }

  function removeSelectedRecipe() {
    const recipeToDelete = recipes.value.find((recipe) => recipe.id === selectedRecipeId.value)
    const deletedRecipeIndex = recipeToDelete ? recipes.value.indexOf(recipeToDelete) : -1
    if (deletedRecipeIndex >= 0) {
      recipes.value.splice(deletedRecipeIndex, 1)
      console.log('Recipe removed')
    } else {
      console.log('Recipe does not exist')
    }
  }

  function addToPublicRecipes(id: string) {
    const fullPublicRecipes = existingPublicRecipes.value.concat(newPublicRecipes.value)
    let publicRecipeExists = false
    fullPublicRecipes.forEach((recipe) => {
      if (recipe.id === id) publicRecipeExists = true
    })

    if (!publicRecipeExists) {
      const recipe = recipes.value.find((recipe) => recipe.id === id) as Recipe
      console.log('new recipe')
      newPublicRecipes.value.push(recipe)
    } else {
      // TODO maybe handle? Or just leave it be as it already exists so it's fine
      console.log('public recipe exists')
    }
  }

  function removeFromPublicRecipes(id: string) {
    const recipe = recipes.value.find((recipe) => recipe.id === id) as Recipe
    removedPublicRecipes.value.push(recipe)
  }

  function setAllRecipes(newRecipes: Recipe[]) {
    recipes.value = newRecipes
  }

  function resetState() {
    userId.value = ''
    recipes.value = []
    existingPublicRecipes.value = []
    newPublicRecipes.value = []
    removedPublicRecipes.value = []
    allTags.value = []
    selectedRecipeId.value = ''
    isSelectedRecipePublic.value = false
    userStore.resetState()
  }

  return {
    userId,
    recipes,
    allTags,
    selectedRecipeId,
    existingPublicRecipes,
    newPublicRecipes,
    removedPublicRecipes,
    isSelectedRecipePublic,
    editSelectedRecipe,
    personalFilters,
    recipesLength,
    getSelectedRecipe,
    getAllRecipeTags,
    useFilteredRecipes,
    setInitialRecipeState,
    getNRandomRecipes,
    updateRecipe,
    addRecipe,
    setSelectedRecipeId,
    setEditStatusSelectedId,
    removeSelectedRecipe,
    addToPublicRecipes,
    removeFromPublicRecipes,
    setAllRecipes,
    resetState
  }
})
