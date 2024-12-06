<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
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
let editSelectedRecipe = ref(false)
let activeFilters = ref<string[]>([])

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
  const newRecipe = {
    id: newId,
    name: 'Default Recipe',
    ingredients: [{ title: 'Ingedients', steps: [] }],
    directions: [{ title: 'Directions', steps: [] }],
    description: '',
    tags: []
  }
  recipeStore.addRecipe(newRecipe)
  selectedRecipe.value = newRecipe
  recipeStore.setSelectedRecipeId(newId)
  editSelectedRecipe.value = true
  //TODO Remove if empty, Error handling
}

function setFilters(filters: string[]) {
  activeFilters.value = filters
}

function removedRecipe() {
  console.log('ok, so what?')
}
//TODO align filter and new recipes look
</script>

<template>
  <div class="recipe-list-container">
    <div class="filter-floating"><FilterComponent @filter="setFilters" :filters="allRecipeTags" /></div>
    <div class="newrecipe-floating-btn"><NewRecipeButtonComponent icon-size="small" @add-new-recipe="newRecipeAdded" /></div>
    <div class="recipeRow" v-if="recipeStore.recipesLength">
      <RecipeListItemComponent
        class="recipe-item-contain"
        v-for="recipe in filteredRecipes.value"
        :key="recipe.id"
        :recipeData="recipe"
        @openRecipe="openRecipeDetail"
        @removedRecipe="removedRecipe" 
      />
      <NewRecipeButtonComponent icon-size="large" @add-new-recipe="newRecipeAdded" />
    </div>
    <RecipesEmptyComponent v-else />
    <div class="recipe-details-container" v-if="selectedRecipe && !editSelectedRecipe">
      <RecipeDetailsComponent
        @closeRecipeDetails="closeRecipeDetails"
        @edit-selected-recipe="editSelectedRecipe = true"
      />
    </div>
    <div class="recipe-details-container" v-else-if="selectedRecipe && editSelectedRecipe">
      <RecipeEditComponent
        class="recipe-item-contain"
        @editing-canceled="editSelectedRecipe = false"
      />
    </div>
  </div>
</template>

<style lang="sass" scoped>

.recipe-list-container
  position: relative
  margin: 0 auto
  justify-items: center
  padding-top: 15px

.filter-floating
  position: absolute
  top: -41px
  right: 25px

  @media (min-width: 768px)
    top: -60px
    right: 40px

.newrecipe-floating-btn
  position: absolute
  top: -43px
  left: 10px

  @media (min-width: 768px)
    top: -60px
    left: 40px  

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

.no-recipes
  text-align: center
  padding-bottom: 50px
</style>
