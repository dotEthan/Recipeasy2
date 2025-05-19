<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { computed, ref } from 'vue'
import { useRecipeStore } from '@/stores/recipeStore'
import RecipeListItemComponent from './recipeListItem/RecipeListItemComponent.vue'
import FilterComponent from './recipeFilter/FilterComponent.vue'
import RecipeDetailsComponent from './recipeDetails/recipeDetailsComponent.vue'
import RecipeEditComponent from './recipeEdit/RecipeEditComponent.vue'
import RecipesEmptyComponent from './recipesEmpty/recipesEmptyComponent.vue'
import NewRecipeButtonComponent from './newRecipeButton/newRecipeButtonComponent.vue'

const recipeStore = useRecipeStore();
let selectedRecipe = computed(() => recipeStore.selectedRecipe);
let activeFilters = ref<string[]>([]);
let isAddedRecipeNew = ref(false);

const filteredRecipes = computed(() => {
  const recipes = recipeStore.useFilteredRecipes(activeFilters.value);
  console.log('recipes: ', recipes)
  return recipes
})

console.log('recipes: ')
let allRecipeTags = ref<string[] | undefined>(undefined)

allRecipeTags.value = recipeStore.getAllRecipeTags;


function closeRecipeDetails() {
  recipeStore.clearSelectedRecipeId();
}

function openRecipeDetail(id: string) {
  console.log('opening: ', id)
  recipeStore.setSelectedRecipeId(id);
}
// TODO Check this is still working
function addNewRecipe() {
  console.log('adding');
  recipeStore.setSelectedRecipeId('1234abcd');
  recipeStore.setEditStatusSelectedId(true);
  isAddedRecipeNew.value = true;
}

function setFilters(filters: string[]) {
  activeFilters.value = filters;
}

function removedRecipe() {
  console.log('ok, so what?')
}

function editingFinishedCleanUp() {
  recipeStore.setEditStatusSelectedId(false);
  isAddedRecipeNew.value = false;
}
//TODO align filter and new recipes look
</script>

<template>
  <div class="recipe-list-container">
    <div class="floating-configs-right">
      <FilterComponent @filter="setFilters" :filters="allRecipeTags" />
    </div>
    <div class="recipeRow" v-if="recipeStore.recipesLength">
      <NewRecipeButtonComponent class="recipe-item-contain" icon-size="large" @add-new-recipe="addNewRecipe" />
      <RecipeListItemComponent
        class="recipe-item-contain"
        v-for="recipe in filteredRecipes.value"
        :key="recipe._id?.toString() ?? uuidv4()"
        :recipeData="recipe"
        @openRecipe="openRecipeDetail"
        @removedRecipe="removedRecipe" 
      />
    </div>
    <RecipesEmptyComponent v-else />
  </div>
  <RecipeDetailsComponent
    v-if="recipeStore.selectedRecipeId && !recipeStore.editSelectedRecipe"
    :selected-recipe="selectedRecipe"
    @closeRecipeDetails="closeRecipeDetails"
    @edit-selected-recipe="recipeStore.setEditStatusSelectedId(true)"
  />
  <RecipeEditComponent
    v-else-if="recipeStore.selectedRecipeId && recipeStore.editSelectedRecipe"
    class="recipe-item-contain"
    :selected-recipe="selectedRecipe"
    :isNew="isAddedRecipeNew"
    @editing-finished="editingFinishedCleanUp"
  />
</template>

<style lang="sass" scoped>

.recipe-list-container
  position: relative
  margin: 0 auto
  justify-items: center
  padding-top: 15px

.floating-configs-right
  position: absolute
  top: -41px
  right: 25px

  @media (min-width: 768px)
    top: -100px
    right: 25vw

.recipeRow
  display: grid
  grid-template-columns: repeat(auto-fill, 42%)
  gap: 15px
  justify-content: center
  position: relative

  @media (min-width: 768px)
    display: grid
    grid-template-columns: repeat(auto-fill, 20%)
    grid-gap: 10px

  @media (min-width: 1050px)
    display: grid
    grid-template-columns: repeat(auto-fill, 10%)
    grid-gap: 10px

.no-recipes
  text-align: center
  padding-bottom: 50px
</style>
