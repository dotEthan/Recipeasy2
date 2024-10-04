<script setup lang="ts">
import { ref, reactive } from 'vue'
import { UseRecipeStore } from '@/stores/recipe'
import { UseUserStore } from '@/stores/user'
import RecipeListItemComponent from './recipeListItem/RecipeListItemComponent.vue'
import CheckboxComponent from '../shared/CheckboxComponent.vue'
import { Filter, CircleX } from 'lucide-vue-next'
import type { Recipe } from '@/types/Recipes'
// import type { Recipe } from '@/types/Recipes'

const recipeStore = UseRecipeStore()
const userStore = UseUserStore()

let filteredRecipes = ref<Recipe[]>([...recipeStore.recipes])

let allUserTags = ref<String[]>([...userStore.allTags])
const filterState = reactive<{ [key: string]: boolean }>({})
let filterList = ref(allUserTags.value as string[])

let mobileFiltersOpen = ref(false)

filterList.value.forEach((filter) => {
  filterState[filter] = false
})

function onNewRecipe() {
  console.log('add recipe')
}

function toggleShowFilters() {
  mobileFiltersOpen.value = !mobileFiltersOpen.value
}

function filterRecipes() {
  const activeFilters = Object.entries(filterState)
    .filter(([_, isChecked]) => isChecked)
    .map(([filterName]) => filterName)

  filteredRecipes.value = recipeStore.recipes.filter((recipe) => {
    console.log('tags: ' + recipe.tags)
    return activeFilters.every((filter) => recipe.tags?.includes(filter))
  })

  if (mobileFiltersOpen.value === true) mobileFiltersOpen.value = false
}
</script>

<template>
  <button class="filter-btn-mobile" @click="toggleShowFilters()">
    <Filter class="filter-icon" />
  </button>
  <div class="filter-box" :class="{ floating: mobileFiltersOpen }">
    <h2 class="filter-title">Filters</h2>
    <CircleX class="button-close" @click="toggleShowFilters()" />
    <div class="filters-contain">
      <CheckboxComponent
        v-for="(filter, index) in filterList"
        :key="index"
        :checkboxLabel="filter"
        v-model="filterState[filter]"
      />
    </div>
    <button @click="filterRecipes()">Filter</button>
  </div>
  <div class="recipe-list-container">
    <div class="recipeRow" v-if="recipeStore.recipeLength">
      <RecipeListItemComponent
        class="recipe-item-contain"
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        :recipeData="recipe"
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
  </div>
</template>

<style lang="sass">

.filter-btn-mobile
  position: absolute
  top: 20px
  right: 20px
  display: flex
  padding: 6px 12px
  background-color: #e0e0e0
  color: #333
  border: none
  border-radius: 30px
  font-family: 'Arial', sans-serif
  font-size: 16px
  cursor: pointer
  transition: all 0.3s ease
  filter: grayscale(100%)
  text-align: center

  &:hover
    filter: grayscale(40%)
    background-color: #d0d0d0
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)

  &:active
    filter: grayscale(20%)
    background-color: #bbb

  &:focus
    outline: none
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5)

  @media (min-width: 768px)
    display: none

.filter-icon
  height: 15px
  width: 15px

.filter-box
  display: none

  @media (min-width: 768px)
    display: block

.floating
  display: block
  position: absolute
  top: 0
  left: 0
  background-color: white
  z-index: 1
  border-radius: 5px

.filter-title
  // display: none
  text-align: center

  @media (min-width: 768px)
    display: block

.button-close
  position: absolute
  top:15px
  right:25px
  cursor: pointer

.filters-contain
  display: flex
  flex-direction: row
  flex-wrap: wrap

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
