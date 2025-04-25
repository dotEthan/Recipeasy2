<script setup lang="ts">
import RecipeListComponent from '@/components/core/recipeList/RecipeListComponent.vue'
import { useRecipeStore } from '@/stores/recipe';
const recipeStore = useRecipeStore()
  console.log("reviews")
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
@use '@/assets/variables' as *

.recipe-viewer
  background: white
  height: 100%
  border-radius: 10px
  width: 100%
  overflow: auto

  .selectedRecipeOpen
    overflow-y: hidden

.headline-title
  margin-top: 10px
  font-family: pacifico, sans-serif
  text-align: center

  @media (min-width: 768px)
    margin: 50px 0

</style>
