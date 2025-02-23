<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { computed, ref } from 'vue'
import { useRecipeStore } from '@/stores/recipe'
import RecipeListItemComponent from './recipeListItem/RecipeListItemComponent.vue'
import FilterComponent from './recipeFilter/FilterComponent.vue'
import type { Recipe } from '@/types/Recipes'
import RecipeDetailsComponent from './recipeDetails/recipeDetailsComponent.vue'
import RecipeEditComponent from './recipeEdit/RecipeEditComponent.vue'
import RecipesEmptyComponent from './recipesEmpty/recipesEmptyComponent.vue'
import NewRecipeButtonComponent from './newRecipeButton/newRecipeButtonComponent.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const recipeStore = useRecipeStore()
let selectedRecipe = ref<Recipe | undefined>(undefined)
let activeFilters = ref<string[]>([])
let isAddedRecipeNew = ref(false);

const filteredRecipes = computed(() => {
  return recipeStore.useFilteredRecipes(activeFilters.value)
})

let allRecipeTags = ref<string[] | undefined>(undefined)

allRecipeTags.value = recipeStore.getAllRecipeTags


function closeRecipeDetails() {
  selectedRecipe.value = undefined
  recipeStore.setSelectedRecipeId('')
}

function openRecipeDetail(id: string) {
  selectedRecipe.value = recipeStore.recipes.find((recipe) => recipe.id === id)
  console.log(selectedRecipe.value?.name)
  recipeStore.setSelectedRecipeId(id)
}

function newRecipeAdded() {
  console.log('adding')
  const newId = uuidv4()
  recipeStore.setSelectedRecipeId(newId)
  recipeStore.setEditStatusSelectedId(true)
  isAddedRecipeNew.value = true;
}

function setFilters(filters: string[]) {
  activeFilters.value = filters
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
      <NewRecipeButtonComponent class="recipe-item-contain" icon-size="large" @add-new-recipe="newRecipeAdded" />
      <RecipeListItemComponent
        class="recipe-item-contain"
        v-for="recipe in filteredRecipes.value"
        :key="recipe.id"
        :recipeData="recipe"
        @openRecipe="openRecipeDetail"
        @removedRecipe="removedRecipe" 
      />
    </div>
    <RecipesEmptyComponent v-else />
  </div>
  <RecipeDetailsComponent
    v-if="recipeStore.selectedRecipeId && !recipeStore.editSelectedRecipe"
    @closeRecipeDetails="closeRecipeDetails"
    @edit-selected-recipe="recipeStore.setEditStatusSelectedId(true)"
  />
  <RecipeEditComponent
    v-else-if="recipeStore.selectedRecipeId && recipeStore.editSelectedRecipe"
    class="recipe-item-contain"
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
