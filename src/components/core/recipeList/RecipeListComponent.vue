<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRecipeStore } from '@/stores/recipe'
import RecipeListItemComponent from './recipeListItem/RecipeListItemComponent.vue'
import FilterComponent from './recipeFilter/FilterComponent.vue'
import type { Recipe } from '@/types/Recipes'
import RecipeDetailsComponent from './recipeDetails/recipeDetailsComponent.vue'
import RecipeEditComponent from './recipeEdit/RecipeEditComponent.vue'

const recipeStore = useRecipeStore()
let selectedRecipe = ref<Recipe | undefined>(undefined)
let editSelectedRecipe = ref(false)
// const recipeDetailElement = useTemplateRef('recipeDetailElement')

let filteredRecipes = ref<Recipe[]>([...recipeStore.recipes])
let allRecipeTags = ref<string[] | undefined>(undefined)

allRecipeTags.value = recipeStore.getAllRecipeTags

watch(recipeStore.recipes, filterRecipes, { deep: true, immediate: true })

function onNewRecipe() {
  recipeStore.setSelectedRecipeId('-1')
  editSelectedRecipe.value = true
  console.log('add recipe')
}

function filterRecipes() {
  const activeFilters = recipeStore.getActiveFilters
  console.log(activeFilters.length)
  if (!activeFilters.length) {
    console.log('No active filters, resetting to full recipe list')
    filteredRecipes.value = [...recipeStore.recipes]
    return
  }

  filteredRecipes.value = recipeStore.recipes.filter(
    (recipe) => activeFilters.length > 0 && recipe.tags?.some((tag) => activeFilters.includes(tag))
  )
}

function closeRecipeDetails() {
  selectedRecipe.value = undefined
}

function openRecipeDetail(id: string) {
  console.log('id: ', id)
  selectedRecipe.value = recipeStore.recipes.find((recipe) => recipe.id === id)
  console.log(selectedRecipe.value?.name)
  recipeStore.setSelectedRecipeId(id)
}
</script>

<template>
  <div class="recipe-list-container">
    <FilterComponent @filter="filterRecipes" :allRecipeTags />
    <div class="recipeRow" v-if="recipeStore.recipeLength">
      <RecipeListItemComponent
        class="recipe-item-contain"
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        :recipeData="recipe"
        @openRecipe="openRecipeDetail"
        @removedRecipe="filterRecipes"
      />
      <div class="new-container">
        <button class="btn new-recipe" @click="onNewRecipe()">+</button>
        <div class="recipe-title">
          <h5>New Recipe</h5>
        </div>
      </div>
    </div>
    <div class="no-recipes" v-else>
      I looked for Recipes and found none. What madness is this? Add a recipe below before you
      starve!
      <div class="new-container">
        <button class="btn new-recipe" @click="onNewRecipe()">+</button>
        <div class="recipe-title">
          <h5>New Recipe</h5>
        </div>
      </div>
    </div>
    <div class="recipe-details-container" v-if="selectedRecipe && !editSelectedRecipe">
      <RecipeDetailsComponent
        @closeRecipeDetails="closeRecipeDetails"
        @edit-selected-recipe="editSelectedRecipe = true"
      />
    </div>
    <div class="recipe-details-container" v-else-if="editSelectedRecipe">
      <RecipeEditComponent
        class="recipe-item-contain"
        @editing-canceled="editSelectedRecipe = false"
      />
    </div>
  </div>
</template>

<style lang="sass">

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
