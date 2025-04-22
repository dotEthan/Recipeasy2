import { defineStore } from 'pinia'
import { ref, computed, ComputedRef, Ref } from 'vue'
import { useUserStore } from './user'
import type { Recipe, RecipeState, RecipeStore } from '@/types/Recipes'
import { useAppStore } from './app'
import { useDataService } from '@/composables/useDataService'
import { Visibility } from '@/types/RecipesEnums'
import { ObjectId } from 'bson'
import { setSessionData } from '@/utilities'
import { CACHED_DATA_TTL } from '@/constants'

export const useRecipeStore = defineStore('recipes', () => {
  const userStore = useUserStore();
  const appStore = useAppStore();
  const dataService = useDataService();

  // Variables
  const recipes = ref<Recipe[]>([]);
  const existingPublicRecipes = ref<Recipe[]>([]);
  const allTags = ref<string[]>([]);
  // TODO update to look at ethan.id's 5 stars
  const ethansFavouritePublicIds = ref<ObjectId[]>([
    new ObjectId('67f1259f3177aa84c4a0595e'),
    new ObjectId('67f1259f3177aa84c4a0595d'),
    new ObjectId('67f1259f3177aa84c4a0594e'),
    new ObjectId('67f125883177aa84c4a05945'),
    new ObjectId('67f1259f3177aa84c4a05952'),
    new ObjectId('67f125883177aa84c4a05937'),
    new ObjectId('67f125883177aa84c4a05938'),
    new ObjectId('67f1259f3177aa84c4a05955'),
    new ObjectId('67f965de2f1269daf320292e'),
    new ObjectId('67f1259f3177aa84c4a0594b'),
    new ObjectId('67f125883177aa84c4a05946'),
  ]);

  const selectedRecipeId = ref<ObjectId | undefined>();
  const editSelectedRecipe = ref<boolean>(false);
  const tempRecipeSaveArray = ref<Recipe[]>([]);
  const tempRecipeDeleteArray = ref<Recipe[]>([]);

  // Computed
  const getAllUserRecipes: ComputedRef<Recipe[]> = computed(() => {
    return recipes.value.concat(tempRecipeSaveArray.value);
  });

  const selectedRecipe: ComputedRef<Recipe | undefined> = computed(() => {
    const allCurrentRecipes = recipes.value.concat(existingPublicRecipes.value);
    return allCurrentRecipes.find(r => r._id === selectedRecipeId.value);
  });

  const isSelectedRecipePublic: ComputedRef<boolean> = computed(() => selectedRecipe.value?.visibility === Visibility.Public);

  const isSelectedRecipeLocalUsers: ComputedRef<boolean> = computed(() => recipes.value.some(recipe => recipe._id === selectedRecipe.value?._id))

  const personalFilters: ComputedRef<string[]> = computed(() => userStore.getUserPersonalPreferences || []);

  const recipesLength: ComputedRef<number> = computed(() => recipes.value.length);

  const existingPublicRecipesLength: ComputedRef<number> = computed(() => existingPublicRecipes.value.length);
  
  const getAllRecipeTags: ComputedRef<string[]> = computed(() =>
    Array.from(
      new Set(
        recipes.value.flatMap(
          (recipe) => recipe.tags?.filter((tag): tag is string => typeof tag === 'string') || []
        )
      )
    )
  )

  // Functions
  function useFilteredRecipes(activeFilters: string[]): ComputedRef<Recipe[]> {
    const allFilters = new Set([...personalFilters.value, ...activeFilters]);
    return computed(() => {
      if (allFilters.size === 0) return getAllUserRecipes.value;
      return getAllUserRecipes.value.filter((recipe) => {
        return recipe.tags.some((tag) => allFilters.has(tag));
      });
    })
  }

  function setInitialPublicRecipeState(publicRecipeData: Recipe[]) {
    existingPublicRecipes.value = publicRecipeData || [];
    selectedRecipeId.value = undefined;
  }

  function setInitialUserRecipeState(userRecipeData: Recipe[]) {
    recipes.value = userRecipeData || [];
    // allTags.value = state.allTags || []
    selectedRecipeId.value = undefined;
  }

    //TODO API call for specific tags or search criteria needed
  function generatePublicRecipeCollections(): Ref<Recipe[]>[] {
    const numberOfRecipesEach = appStore.screenSize === 'sm' ? 6 : 5;
    const length = existingPublicRecipes.value.length;
    const usedIndices = new Set<number>();
    console.log('number needed:', numberOfRecipesEach)
    // TODO refactor this
    const ethansFavoriteIndices = ethansFavouritePublicIds.value
        .map((id) => existingPublicRecipes.value.findIndex((recipe) => recipe._id === id))
        .filter((index) => index !== -1);

    console.log('indices: ', numberOfRecipesEach)
    const ethansCollection: Recipe[] = [];
    while (ethansCollection.length < numberOfRecipesEach && ethansFavoriteIndices.length > 0) {
        const randomIndex = Math.floor(Math.random() * ethansFavoriteIndices.length);
        const recipeIndex = ethansFavoriteIndices.splice(randomIndex, 1)[0];
        usedIndices.add(recipeIndex);
        ethansCollection.push(existingPublicRecipes.value[recipeIndex]);
    }
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
    console.log('mine: ', ethansCollection)
    return [ref(ethansCollection), ...randomCollections];
  }

  function getRecipeById(id: ObjectId): Recipe | undefined {
    return recipes.value.find((recipe) => recipe._id === id);
  }
  
  function updateRecipe(recipe: Recipe) {
    recipes.value = recipes.value.map((r) => (r._id === recipe._id ? recipe : r))
  }

  function addRecipe(recipe: Recipe) {
    recipes.value.push(recipe)
  }

  function setSelectedRecipeId(id: ObjectId) {
    console.log('setting: ', id)
    selectedRecipeId.value = id;
  }

  function setEditStatusSelectedId(status: boolean) {
    editSelectedRecipe.value = status
  }

  function revertRecipeDeletion(id: ObjectId) {
    console.log('delete failed')
    if (tempRecipeDeleteArray.value.length > 0) {
      const recipe = tempRecipeDeleteArray.value.find(recipe => recipe._id === id) as Recipe;
      console.log('recipe has temps: ', recipe)
      recipes.value.push(recipe);
    } else {
      console.log('no recipes waiting to be deleted')
    }
  }

  function finishRecipeDeletion() {
    tempRecipeDeleteArray.value = [];
  }

  function prepareRecipeDeletion(id: ObjectId) {
    const recipe = getRecipeById(id);
    console.log('has recipe:', recipe)
    if (recipe) tempRecipeDeleteArray.value.push(recipe);
    console.log('temp recipe:', tempRecipeDeleteArray)
    removeRecipeById(id);
  }

  // TODO refactor into removeRecipeById(id)
  function removeRecipeById(id: ObjectId) {
    const recipeToDelete = recipes.value.find((recipe) => recipe._id === id)
    const deletedRecipeIndex = recipeToDelete ? recipes.value.indexOf(recipeToDelete) : -1
    if (deletedRecipeIndex >= 0) {
      recipes.value.splice(deletedRecipeIndex, 1)
    } else {
      console.log('Recipe does not exist')
    }
  }

  function addToPublicRecipes(newPublicRecipe: Recipe) {
    // TODO remve this function from everywhere if not already
    console.log('not needed to add: ', newPublicRecipe);
  }

  function removeFromPublicRecipes(id: string) {
    // TODO remve this function from everywhere if not already
    console.log('not needed to remove: ', id);
  }

  function addNewTempRecipe(recipe: Recipe) {
    tempRecipeSaveArray.value.push(recipe);
  }

  function removeTempLocalRecipe(recipeToDelete: Recipe) {
    const newArray = tempRecipeSaveArray.value.filter(recipe => recipe.name !== recipeToDelete.name)
    tempRecipeSaveArray.value = newArray;
  }

  function revertFailedSave(recipeToDelete: Recipe) { 
  
  }

  function clearSelectedRecipeId() {
    selectedRecipeId.value = undefined;
  }

  function hydrateStore(RecipeState: RecipeState) {
    recipes.value = RecipeState.recipes || [];
    existingPublicRecipes.value = RecipeState.existingPublicRecipes || [];
    allTags.value = RecipeState.allTags || []
    ethansFavouritePublicIds.value = RecipeState.ethansFavouritePublicIds || [];
    selectedRecipeId.value = RecipeState.selectedRecipeId;
    editSelectedRecipe.value = RecipeState.editSelectedRecipe;
    tempRecipeSaveArray.value = RecipeState.tempRecipeSaveArray;
    tempRecipeDeleteArray.value = RecipeState.tempRecipeDeleteArray;

  }
  
  function cacheRecipeState() {
    console.log('caching recipes')
    setSessionData('recipes', {
      recipes: recipes.value,
      existingPublicRecipes: existingPublicRecipes.value,
      allTags: allTags.value,
      ethansFavouritePublicIds: ethansFavouritePublicIds.value,
      selectedRecipeId: selectedRecipeId.value,
      editSelectedRecipe: editSelectedRecipe.value,
      tempRecipeSaveArray: tempRecipeSaveArray.value,
      tempRecipeDeleteArray: tempRecipeDeleteArray.value,
      expiresAt: new Date().getTime() + (CACHED_DATA_TTL)
    });
    console.log('finished recipes')
  }

  function resetState() {
    recipes.value = [];
    existingPublicRecipes.value = [];
    allTags.value = [];
    clearSelectedRecipeId();
  }

  function resetUserRecipeState() {
    recipes.value = [];
    allTags.value = [];
    editSelectedRecipe.value = false;
    tempRecipeSaveArray.value = [];
    tempRecipeDeleteArray.value = [] ;
    clearSelectedRecipeId();
  }

  return {
    recipes,
    allTags,
    selectedRecipeId,
    existingPublicRecipes,
    editSelectedRecipe,
    getAllUserRecipes,
    selectedRecipe,
    isSelectedRecipePublic,
    isSelectedRecipeLocalUsers,
    personalFilters,
    tempRecipeSaveArray,
    tempRecipeDeleteArray,
    recipesLength,
    existingPublicRecipesLength,
    getAllRecipeTags,
    useFilteredRecipes,
    setInitialUserRecipeState,
    setInitialPublicRecipeState,
    generatePublicRecipeCollections,
    getRecipeById,
    updateRecipe,
    addRecipe,
    setSelectedRecipeId,
    setEditStatusSelectedId,
    finishRecipeDeletion,
    revertRecipeDeletion,
    prepareRecipeDeletion,
    removeRecipeById,
    addToPublicRecipes,
    removeFromPublicRecipes,
    addNewTempRecipe,
    removeTempLocalRecipe,
    clearSelectedRecipeId,
    hydrateStore,
    cacheRecipeState,
    resetState,
    resetUserRecipeState
  }
})
