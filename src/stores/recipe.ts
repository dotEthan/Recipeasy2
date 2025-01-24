import { defineStore } from 'pinia'
import { ref, computed, ComputedRef, Ref } from 'vue'
import { useUserStore } from './user'
import type { Recipe, RecipeStore } from '@/types/Recipes'
import { UserState } from '@/types/UserState'

export const useRecipeStore = defineStore('recipes', () => {
  const userStore = useUserStore()
  const userId = ref<string>('')
  const recipes = ref<Recipe[]>([])
  const existingPublicRecipes = ref<Recipe[]>([])
  const newPublicRecipes = ref<Recipe[]>([])
  const removedPublicRecipes = ref<Recipe[]>([])
  const allTags = ref<string[]>([])
  const usedPublicRecipeIndices = ref<Set<number>>(new Set())

  const selectedRecipeId = ref<string>('')
  const isSelectedRecipePublic = ref<boolean>(false)
  const editSelectedRecipe = ref<boolean>(false)

  const personalFilters: ComputedRef<string[]> = computed(() => userStore.localUser.personalFilters || [])

  const recipesLength: ComputedRef<number> = computed(() => recipes.value.length)

  const existingPublicRecipesLength: ComputedRef<number> = computed(() => existingPublicRecipes.value.length)

  const getSelectedRecipe: ComputedRef<Recipe> = computed(() => {
    const recipe = /^pub-/.test(selectedRecipeId.value)
      ? existingPublicRecipes.value.find((recipe) => recipe.id === selectedRecipeId.value)
      : recipes.value.find((recipe) => recipe.id === selectedRecipeId.value)

    if (!recipe) {
      throw new Error(`Recipe with ID ${selectedRecipeId.value} not found.`)
    }
    return recipe
  })
  
  const getAllRecipeTags: ComputedRef<string[]> = computed(() =>
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


  function getNRandomPublicRecipes(numberOfRecipes: number): Ref<Recipe[]> {
    const length = existingPublicRecipesLength.value;
    const availableIndices = length - 1 - usedPublicRecipeIndices.value.size;

    const numToGet = Math.min(numberOfRecipes, availableIndices);

    const indices = new Set<number>();
    while (indices.size < numToGet) {
      const randomIndex = Math.floor(Math.random() * (length-1));
      if (!usedPublicRecipeIndices.value.has(randomIndex)) {
        indices.add(randomIndex);
        usedPublicRecipeIndices.value.add(randomIndex);
      }
    }
    return ref(Array.from(indices).map(index => existingPublicRecipes.value[index]));
}

  function updateRecipe(recipe: Recipe) {
    recipes.value = recipes.value.map((r) => (r.id === recipe.id ? recipe : r))
  }

  function addRecipe(recipe: Recipe) {
    recipes.value.push(recipe)
  }

  function setSelectedRecipeId(id: string) {
    selectedRecipeId.value = id
    isSelectedRecipePublic.value = /^pub-/.test(id);
  }

  function setEditStatusSelectedId(status: boolean) {
    editSelectedRecipe.value = status
  }

  // TODO refactor into removeRecipeById(id)
  function removeRecipeById(id: string) {
    const recipeToDelete = recipes.value.find((recipe) => recipe.id === selectedRecipeId.value)
    const deletedRecipeIndex = recipeToDelete ? recipes.value.indexOf(recipeToDelete) : -1
    if (deletedRecipeIndex >= 0) {
      recipes.value.splice(deletedRecipeIndex, 1)
    } else {
      console.log('Recipe does not exist')
    }
  }

  function addToPublicRecipes(newPublicRecipe: Recipe) {
    const recipeAlreadyAdded = newPublicRecipes.value.some(recipe => recipe.id === newPublicRecipe.id)
    const previouslyRemoved = removedPublicRecipes.value.some(recipe => recipe.id === newPublicRecipe.id)
    console.log('was prevoiusly removed: ', previouslyRemoved)
    if (previouslyRemoved) {
      console.log('already removed')
      removedPublicRecipes.value = removedPublicRecipes.value.filter(recipe => recipe.id !== newPublicRecipe.id);
    } else if (!recipeAlreadyAdded) {
      console.log('new public recipe: ', newPublicRecipe)
      newPublicRecipes.value.push(newPublicRecipe)
    } else {
      // TODO maybe handle? Or just leave it be as it already exists so it's fine
      console.log('public recipe already added')
    }
  }

  function removeFromPublicRecipes(id: string) {
    // Check if newly added
    const isNewlyAdded = newPublicRecipes.value.some(recipe => recipe.id === id)
    if (isNewlyAdded) {
      newPublicRecipes.value = newPublicRecipes.value.filter(recipe => recipe.id !== id);
    } else {
      const recipe = recipes.value.find((recipe) => recipe.id === id) as Recipe
      removedPublicRecipes.value.push(recipe)
    }
  }

  function resetNewPublicRecipes() {
    existingPublicRecipes.value = []
    newPublicRecipes.value = []
  }

  function resetRemovedPublicRecipes() {
    removedPublicRecipes.value = []
  }

  function resetUsedPublicIndices() {
    usedPublicRecipeIndices.value.clear()
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
    usedPublicRecipeIndices,
    removedPublicRecipes,
    isSelectedRecipePublic,
    editSelectedRecipe,
    personalFilters,
    recipesLength,
    existingPublicRecipesLength,
    getSelectedRecipe,
    getAllRecipeTags,
    useFilteredRecipes,
    setInitialRecipeState,
    getNRandomPublicRecipes,
    updateRecipe,
    addRecipe,
    setSelectedRecipeId,
    setEditStatusSelectedId,
    removeRecipeById,
    addToPublicRecipes,
    removeFromPublicRecipes,
    resetNewPublicRecipes,
    resetRemovedPublicRecipes,
    resetUsedPublicIndices,
    resetState
  }
})
