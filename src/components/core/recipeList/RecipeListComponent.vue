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
</script>

<template>
  <div class="recipe-list-container">
    <FilterComponent @filter="setFilters" :allRecipeTags />
    <div class="recipeRow" v-if="recipeStore.recipesLength">
      <RecipeListItemComponent
        class="recipe-item-contain"
        v-for="recipe in filteredRecipes.value"
        :key="recipe.id"
        :recipeData="recipe"
        @openRecipe="openRecipeDetail"
        @removedRecipe="removedRecipe" 
      />
      <NewRecipeButtonComponent @add-new-recipe="newRecipeAdded" />
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
  width: 90%
  margin: 0 auto
  justify-items: center

.recipeRow
  display: flex
  flex-direction: row
  flex-wrap: wrap
  margin: 0 0 20px
  position: relative
  align-items: center
  justify-content: space-around

  @supports (display:grid)
    display: grid
    grid-template-columns: repeat(auto-fill, 100px)
    grid-gap: 5px

  @media (min-width: 768px)

    @supports (display:grid)
      display: grid
      grid-template-columns: repeat(auto-fill, 125px)
      grid-gap: 10px

.new-container
  width: 100px
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center

  @media (min-width: 768px)
    width: 125px

.new-recipe
  height: 75px
  width: 75px
  font-size: 4rem
  color: #aaa
  border: 2px solid #aaa
  border-radius: 8px
  transition: all .3s

  &:hover
    color: #888
    border: 2px solid #888
    font-size: 4.5rem

  @media (min-width: 768px)
    width: 100px
    height: 100px

.recipe-title
  text-align: center
  margin: 10px 0
  color: #223
  height: 30px

  h5
    font-size: 1rem

    @media (min-width: 768px)
      font-size: 1.2rem

.no-recipes
  text-align: center
  padding-bottom: 50px
</style>
