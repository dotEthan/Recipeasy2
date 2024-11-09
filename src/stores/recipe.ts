import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Recipe, RecipeState } from '@/types/Recipes'

export const useRecipeStore = defineStore('recipes', () => {
  const userId = ref<string>('')
  const recipes = ref<Recipe[]>([])
  const allTags = ref<string[]>([])
  const selectedRecipeId = ref<string>('')
  const editSelectedRecipe = ref(false)
  const activeFilters = ref<string[]>([])

  const recipeLength = computed(() => recipes.value.length)
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
  const getActiveFilters = computed(() => activeFilters.value)

  function setRecipeState(state: RecipeState) {
    userId.value = state.userId
    recipes.value = state.recipes || []
    allTags.value = state.allTags || []
    selectedRecipeId.value = state.selectedRecipeId || ''
    activeFilters.value = state.activeFilters || []
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

  function setActiveFilters(filters: string[]) {
    activeFilters.value = filters
  }

  function setAllRecipes(newRecipes: Recipe[]) {
    recipes.value = newRecipes
  }

  function loadDummyData() {
    userId.value = '1'
    recipes.value = [
      {
        id: 'testmode',
        name: 'Beyond Burger',
        description: 'A burger Beyond Burgers of Burger Beyondness',
        ingredients: [
          {
            title: 'burger and fries',
            steps: [
              { name: 'stuff', amount: '3', unit: 'cups' },
              { name: 'seitan burger', amount: '3', unit: 'cups' },
              { name: 'spices' },
              { name: 'potatoes', amount: '4' }
            ]
          },
          {
            title: 'Bun',
            steps: [
              { name: 'wheat', amount: '', unit: 'cups' },
              { name: 'Buckwheat', amount: '1', unit: 'cup' },
              { name: 'water', amount: 'till done' },
              { name: 'salt', unit: 'tbsp' }
            ]
          }
        ],
        directions: [
          { title: 'Burger', steps: ['cook burger', 'bake fries', 'add stuff if you want'] },
          { title: 'bun', steps: ['combine', 'smoke break', 'Proft!'] }
        ],
        imgPath: 'https://picsum.photos/seed/picsum/200/300',
        rating: 3.5,
        private: true,
        tags: ['burger', 'snack', 'dinner', 'fast food', 'vegan']
      }
    ]
    selectedRecipeId.value = ''
    activeFilters.value = []
  }

  function resetState() {
    userId.value = ''
    recipes.value = []
    allTags.value = []
    selectedRecipeId.value = ''
    activeFilters.value = []
  }

  return {
    userId,
    recipes,
    allTags,
    selectedRecipeId,
    editSelectedRecipe,
    activeFilters,
    recipeLength,
    getSelectedRecipe,
    getAllRecipeTags,
    getActiveFilters,
    setRecipeState,
    updateRecipe,
    addRecipe,
    setSelectedRecipeId,
    removeSelectedRecipe,
    setActiveFilters,
    setAllRecipes,
    loadDummyData,
    resetState
  }
})
