import { defineStore } from 'pinia'
import { ref, computed, ComputedRef } from 'vue'
import type { Recipe, RecipeState } from '@/types/Recipes'
import { useUserStore } from './user'

export const useRecipeStore = defineStore('recipes', () => {
  const userStore = useUserStore()
  const userId = ref<string>('')
  const recipes = ref<Recipe[]>([])
  const allTags = ref<string[]>([])
  const selectedRecipeId = ref<string>('')
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

  function setInitialRecipeState(state: RecipeState) {
    userId.value = state.userId
    recipes.value = state.recipes || []
    allTags.value = state.allTags || []
    selectedRecipeId.value = state.selectedRecipeId || ''
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
    recipes.value = recipes.value.map((r) => (r.id === recipe.id ? recipe : r))
  }

  function addRecipe(recipe: Recipe) {
    recipes.value.push(recipe)
  }

  function setSelectedRecipeId(id: string) {
    selectedRecipeId.value = id
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


  function setAllRecipes(newRecipes: Recipe[]) {
    recipes.value = newRecipes
  }

  function resetState() {
    userId.value = ''
    recipes.value = []
    allTags.value = []
    selectedRecipeId.value = ''
    userStore.resetState()
  }

  return {
    userId,
    recipes,
    allTags,
    selectedRecipeId,
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
    removeSelectedRecipe,
    setAllRecipes,
    resetState
  }
})
