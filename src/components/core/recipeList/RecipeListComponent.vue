<script setup lang="ts">
import { useRecipeStore } from '@/stores/recipe'
import RecipeListItemComponent from './recipeListItem/RecipeListItemComponent.vue'

const recipeStore = useRecipeStore()

function onNewRecipe() {
  console.log('add recipe')
}
</script>

<template>
  <div class="row">
    <div class="recipe-list-container">
      <div class="recipeRow" v-if="recipeStore.recipeLength">
        <RecipeListItemComponent
          class="recipe-item-contain"
          v-for="recipe in recipeStore.recipes"
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
