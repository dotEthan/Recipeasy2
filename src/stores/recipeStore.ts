import { defineStore } from "pinia";

import { ComputedRef, Ref, computed, ref, watch, watchEffect } from "vue";

import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";
import { Recipe, RecipeState, RecipeStore, Visibility } from "@/types/Recipes.d";
import { formatCachedValue } from "@/utilities";

/**
 * Store for all Recipe Related Data
 * @typedef {Object} RecipeStore
 * @todo Update Mock Store and Apply store types
 * @todo refactor to multiple stores?
 * @todo Update "ethansFavouritePublicIds" to a search of DB for top rated by me
 */

export const useRecipeStore = defineStore("recipes", (): RecipeStore => {
  const userStore = useUserStore();
  const appStore = useAppStore();

  // Variables
  const recipes = ref<Recipe[]>([]);
  const publicRecipes = ref<Recipe[]>([]);
  const allTags = ref<string[]>([]);
  const ethansFavouritePublicIds = ref<string[]>([
    "67f1259f3177aa84c4a0595e",
    "67f1259f3177aa84c4a0595d",
    "67f1259f3177aa84c4a0594e",
    "67f125883177aa84c4a05945",
    "67f1259f3177aa84c4a05952",
    "67f125883177aa84c4a05937",
    "67f125883177aa84c4a05938",
    "67f1259f3177aa84c4a05955",
    "67f965de2f1269daf320292e",
    "67f1259f3177aa84c4a0594b",
    "67f125883177aa84c4a05946"
  ]);

  const selectedRecipeId = ref<string | undefined>();
  const editSelectedRecipe = ref<boolean>(false);
  const tempRecipeSaveArray = ref<Recipe[]>([]);
  const tempRecipeDeleteArray = ref<Recipe[]>([]);

  // Watchers
  watch(
    () => recipes.value,
    (newRecipes: Recipe[]) => {
      sessionStorage.setItem("userRecipes", formatCachedValue(newRecipes));
    },
    { deep: true }
  );

  watch(
    () => publicRecipes.value,
    (newPublicRecipes: Recipe[]) => {
      sessionStorage.setItem("publicRecipes", formatCachedValue(newPublicRecipes));
    },
    { deep: true }
  );

  watch(
    () => allTags.value,
    (newAllTags: string[]) => {
      sessionStorage.setItem("allTags", formatCachedValue(newAllTags));
    },
    { deep: true }
  );

  watch(
    () => selectedRecipeId.value,
    (newSelectedRecipeId: string | undefined) => {
      if (newSelectedRecipeId !== undefined) {
        sessionStorage.setItem("selectedRecipeId", newSelectedRecipeId);
      } else {
        sessionStorage.removeItem("selectedRecipeId");
      }
    }
  );

  watchEffect(() => {
    sessionStorage.setItem("editSelectedRecipe", String(editSelectedRecipe.value));
  });

  // Computed
  const getAllUserRecipes: ComputedRef<Recipe[]> = computed(() => {
    return recipes.value.concat(tempRecipeSaveArray.value);
  });

  const selectedRecipe: ComputedRef<Recipe | undefined> = computed(() => {
    const allCurrentRecipes = recipes.value
      .concat(publicRecipes.value)
      .concat(tempRecipeSaveArray.value);
    return allCurrentRecipes.find((r) => r._id === selectedRecipeId.value);
  });

  const isSelectedRecipePublic: ComputedRef<boolean> = computed(
    () => selectedRecipe.value?.visibility === Visibility.Public
  );

  const isSelectedRecipeInLocalUsersRecipes: ComputedRef<boolean> = computed(() =>
    recipes.value.some((recipe) => recipe._id === selectedRecipe.value?._id)
  );

  const isSelectedRecipeLocalUsers: ComputedRef<boolean> = computed(
    () => selectedRecipe.value?.userId === userStore.getCurrentUserId
  );

  const personalFilters: ComputedRef<string[]> = computed(
    () => userStore.getUserPersonalPreferences || []
  );

  const recipesLength: ComputedRef<number> = computed(() => recipes.value.length);

  const publicRecipesLength: ComputedRef<number> = computed(() => publicRecipes.value.length);

  const getAllRecipeTags: ComputedRef<string[]> = computed(() =>
    Array.from(
      new Set(
        recipes.value.flatMap(
          (recipe) => recipe.tags?.filter((tag): tag is string => typeof tag === "string") || []
        )
      )
    )
  );

  // Functions
  function useFilteredRecipes(activeFilters: string[]): ComputedRef<Recipe[]> {
    const allFilters = new Set([...personalFilters.value, ...activeFilters]);
    return computed(() => {
      if (allFilters.size === 0) return getAllUserRecipes.value;
      return getAllUserRecipes.value.filter((recipe) => {
        return recipe.tags.some((tag) => allFilters.has(tag));
      });
    });
  }

  function setInitialPublicRecipeState(publicRecipeData: Recipe[]) {
    publicRecipes.value = publicRecipeData || [];
    selectedRecipeId.value = undefined;
  }

  function setInitialUserRecipeState(userRecipeData: Recipe[]) {
    recipes.value = userRecipeData || [];
    // allTags.value = state.allTags || []
    selectedRecipeId.value = undefined;
  }

  //TODO API call for specific tags or search criteria needed
  function generatePublicRecipeCollections(): Ref<Recipe[]>[] {
    const numberOfRecipesEach = appStore.screenSize === "sm" ? 6 : 5;
    const length = publicRecipes.value.length;
    const usedIndices = new Set<number>();
    // TODO refactor this
    const ethansFavoriteIndices = ethansFavouritePublicIds.value
      .map((id) => publicRecipes.value.findIndex((recipe) => recipe._id === id))
      .filter((index) => index !== -1);

    const ethansCollection: Recipe[] = [];
    while (ethansCollection.length < numberOfRecipesEach && ethansFavoriteIndices.length > 0) {
      const randomIndex = Math.floor(Math.random() * ethansFavoriteIndices.length);
      const recipeIndex = ethansFavoriteIndices.splice(randomIndex, 1)[0];
      usedIndices.add(recipeIndex);
      ethansCollection.push(publicRecipes.value[recipeIndex]);
    }
    const randomCollections = Array.from({ length: 4 }, () => {
      const recipesInGroup: Recipe[] = [];

      while (recipesInGroup.length < numberOfRecipesEach && usedIndices.size < length) {
        const randomIndex = Math.floor(Math.random() * length);

        if (!usedIndices.has(randomIndex)) {
          usedIndices.add(randomIndex);
          recipesInGroup.push(publicRecipes.value[randomIndex]);
        }
      }

      return ref(recipesInGroup);
    });
    return [ref(ethansCollection), ...randomCollections];
  }

  function updatePublicRecipe(recipe: Recipe) {
    const index = publicRecipes.value.findIndex((publicRecipe) => publicRecipe._id === recipe._id);
    if (index === -1) {
      return;
    }
    publicRecipes.value = [
      ...publicRecipes.value.slice(0, index),
      recipe,
      ...publicRecipes.value.slice(index + 1)
    ];
  }

  function getRecipeById(id: string): Recipe | undefined {
    return recipes.value.find((recipe) => recipe._id === id);
  }

  function updateRecipe(recipe: Recipe) {
    recipes.value = recipes.value.map((r) => (r._id === recipe._id ? recipe : r));
  }

  function addRecipe(recipe: Recipe) {
    recipes.value = [...recipes.value, recipe];
  }

  function setSelectedRecipeId(id: string) {
    selectedRecipeId.value = id;
  }

  function setEditStatusSelectedId(status: boolean) {
    editSelectedRecipe.value = status;
  }

  function backupNewRecipeDataForSave(recipe: Recipe) {
    tempRecipeSaveArray.value.push(recipe);
  }

  function prepareRecipeDeletion(id: string) {
    const recipe = getRecipeById(id);
    if (recipe) {
      tempRecipeDeleteArray.value = [...tempRecipeDeleteArray.value, recipe];
    }
    removeRecipeById(id);
  }

  function finishRecipeDeletion() {
    tempRecipeDeleteArray.value = [];
  }

  function revertRecipeDeletion(id: string) {
    if (tempRecipeDeleteArray.value.length > 0) {
      const recipe = tempRecipeDeleteArray.value.find((recipe) => recipe._id === id) as Recipe;
      addRecipe(recipe);
    } else {
      console.log("no recipes waiting to be deleted");
    }
  }

  function removeRecipeById(id: string) {
    const index = recipes.value.findIndex((recipe) => recipe._id === id);
    if (index === -1) throw new Error("Recipe for deletion does not exist");

    recipes.value = recipes.value.filter((recipe) => recipe._id !== id);
  }

  // Optimistic UI - Remove from main array, add to temp while update in progress
  // need two temp arrays, updated (to show recent updates), oldRecipe to revert to
  function prepRecipeDataForUpdate(recipe: Recipe) {
    const oldRecipe = recipes.value.find((existingRecipe) => existingRecipe._id === recipe._id);

    if (!oldRecipe) throw new Error("no old recipe found for updating, ruh roh!");
    tempRecipeSaveArray.value.push(oldRecipe);
    removeRecipeById(recipe._id);
  }

  function finishSuccessfulSave(updatedRecipe: Recipe) {
    const newArray = tempRecipeSaveArray.value.filter(
      (recipe) => recipe.name !== updatedRecipe.name
    );
    tempRecipeSaveArray.value = newArray;

    addRecipe(updatedRecipe);
  }

  function revertFailedSave(recipeToRevert: Recipe) {
    const oldRecipe = tempRecipeSaveArray.value.find(
      (recipe) => recipe.name === recipeToRevert.name
    );

    const newArray = tempRecipeSaveArray.value.filter(
      (recipe) => recipe._id !== recipeToRevert._id
    );
    tempRecipeSaveArray.value = newArray;

    if (oldRecipe) {
      console.log("oldRecipe: ", oldRecipe);
      // TODO Notify User and return to edit screen?
    }
  }

  function finishSuccessfulUpdate(updatedRecipe: Recipe) {
    const newArray = tempRecipeSaveArray.value.filter((recipe) => recipe._id !== updatedRecipe._id);
    tempRecipeSaveArray.value = newArray;

    addRecipe(updatedRecipe);
  }

  function revertFailedUpdate(recipeToRevert: Recipe) {
    const oldRecipe = tempRecipeSaveArray.value.find((recipe) => recipe._id === recipeToRevert._id);

    const newArray = tempRecipeSaveArray.value.filter(
      (recipe) => recipe._id !== recipeToRevert._id
    );
    tempRecipeSaveArray.value = newArray;

    if (oldRecipe) {
      addRecipe(oldRecipe);
    }
  }

  function clearSelectedRecipeId() {
    selectedRecipeId.value = undefined;
  }

  function hydrateStore(RecipeState: RecipeState) {
    recipes.value = RecipeState.recipes || [];
    publicRecipes.value = RecipeState.publicRecipes || [];
    allTags.value = RecipeState.allTags || [];
    selectedRecipeId.value = RecipeState.selectedRecipeId;
    editSelectedRecipe.value = RecipeState.editSelectedRecipe;
  }

  function resetState() {
    recipes.value = [];
    publicRecipes.value = [];
    allTags.value = [];
    clearSelectedRecipeId();
  }

  function resetUserRecipeState() {
    recipes.value = [];
    allTags.value = [];
    editSelectedRecipe.value = false;
    tempRecipeSaveArray.value = [];
    tempRecipeDeleteArray.value = [];
    clearSelectedRecipeId();
  }

  return {
    recipes,
    publicRecipes,
    allTags,
    ethansFavouritePublicIds,
    selectedRecipeId,
    editSelectedRecipe,
    tempRecipeDeleteArray,
    tempRecipeSaveArray,

    getAllUserRecipes,
    selectedRecipe,
    isSelectedRecipePublic,
    isSelectedRecipeInLocalUsersRecipes,
    isSelectedRecipeLocalUsers,
    personalFilters,
    recipesLength,
    publicRecipesLength,
    getAllRecipeTags,

    useFilteredRecipes,
    setInitialUserRecipeState,
    setInitialPublicRecipeState,
    generatePublicRecipeCollections,
    updatePublicRecipe,
    getRecipeById,
    updateRecipe,
    addRecipe,
    setSelectedRecipeId,
    setEditStatusSelectedId,
    backupNewRecipeDataForSave,
    prepareRecipeDeletion,
    finishRecipeDeletion,
    revertRecipeDeletion,
    removeRecipeById,
    prepRecipeDataForUpdate,
    finishSuccessfulUpdate,
    finishSuccessfulSave,
    revertFailedUpdate,
    revertFailedSave,
    clearSelectedRecipeId,
    hydrateStore,
    resetState,
    resetUserRecipeState
  };
});
