import { defineStore } from 'pinia'
import { ref, computed, ComputedRef, Ref } from 'vue'
import { useUserStore } from './user'
import type { Recipe, RecipeStore } from '@/types/Recipes'
import { UserState } from '@/types/UserState'
import { useAppStore } from './app'

export const useRecipeStore = defineStore('recipes', () => {
  const userStore = useUserStore()
  const appStore = useAppStore()
  const userId = ref<string>('')
  const recipes = ref<Recipe[]>([])
  const existingPublicRecipes = ref<Recipe[]>([])
  const newPublicRecipes = ref<Recipe[]>([])
  const removedPublicRecipes = ref<Recipe[]>([])
  const allTags = ref<string[]>([])
  // TODO update to look at ethan.id's 5 stars
  const ethansFavouritePublicIds = ref<string[]>([
    'pub-8611a75d-cdb3-446c-8716-caecc2ee8f5f',
    'pub-VR004',
    'pub-ea6b4bf8-3156-49d6-9e97-a5757ff5b6b2',
    'pub-test-2',
    'pub-test-3',
    'pub-test-4',
    'pub-test-5'
  ]);

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

  function generatePublicRecipeCollections(): Ref<Recipe[]>[] {
    const numberOfRecipesEach = appStore.screenSize === 'sm' ? 6 : 5;
    const length = existingPublicRecipes.value.length;
    const usedIndices = new Set<number>();

    const ethansFavoriteIndices = ethansFavouritePublicIds.value
        .map((id) => existingPublicRecipes.value.findIndex((recipe) => recipe.id === id))
        .filter((index) => index !== -1);

    const ethansCollection: Recipe[] = [];
    while (ethansCollection.length < numberOfRecipesEach && ethansFavoriteIndices.length > 0) {
        const randomIndex = Math.floor(Math.random() * ethansFavoriteIndices.length);
        const recipeIndex = ethansFavoriteIndices.splice(randomIndex, 1)[0];
        usedIndices.add(recipeIndex);
        ethansCollection.push(existingPublicRecipes.value[recipeIndex]);
    }
    //TODO Generate other arrays based on tags/etc
    const randomCollections = Array.from({ length: 4 }, () => {
        const recipesInGroup: Recipe[] = [];

        while (recipesInGroup.length < numberOfRecipesEach && usedIndices.size < length) {
            const randomIndex = Math.floor(Math.random() * length);

            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                recipesInGroup.push(existingPublicRecipes.value[randomIndex]);
            }
        }

        return ref(recipesInGroup);
    });

    return [ref(ethansCollection), ...randomCollections];
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
    existingPublicRecipesLength,
    getSelectedRecipe,
    getAllRecipeTags,
    useFilteredRecipes,
    setInitialRecipeState,
    generatePublicRecipeCollections,
    updateRecipe,
    addRecipe,
    setSelectedRecipeId,
    setEditStatusSelectedId,
    removeRecipeById,
    addToPublicRecipes,
    removeFromPublicRecipes,
    resetNewPublicRecipes,
    resetRemovedPublicRecipes,
    resetState
  }
})
