<script setup lang="ts">
import RecipeListComponent from '@/components/core/recipeList/RecipeListComponent.vue'
import { useRecipeStore } from '@/stores/recipe';
const recipeStore = useRecipeStore()

</script>

<template>
  <div class="base-container">
    <div class="recipe-viewer" :class="{selectedRecipeOpen: recipeStore.selectedRecipeId}">
      <div class="headline-title">
        <h1>Your Recipes</h1>
      </div>
      <RecipeListComponent />
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import '../assets/variables.sass'

.recipe-viewer
  background: white
  height: 100%
  border-radius: 10px
  width: 100%
  overflow: auto

  .selectedRecipeOpen
    overflow-y: hidden

  @media (min-width: 768px)
    max-width: 1366px



.headline-title
  margin-top: 10px
  font-family: pacifico, sans-serif
  text-align: center

  @media (min-width: 768px)
    margin-top: 25px


  @media (min-width: 1200px)
    margin: 50px 0

</style>
