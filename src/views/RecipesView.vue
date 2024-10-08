<script setup lang="ts">
import RecipeListComponent from '@/components/core/recipeList/RecipeListComponent.vue'
</script>

<template>
  <div class="base-container">
    <div class="row borderize-contain">
      <div class="headline-title">
        <h1>Recipe Book</h1>
      </div>
      <div class="recipe-viewer">
        <RecipeListComponent />
      </div>
    </div>
  </div>
</template>

<style lang="sass">
@import '../assets/variables.sass'

.borderize
  background: white
  height: calc(100vh - #{$navbar-height-minus} - #{$borderize-margin})
  border-radius: 10px
  width: calc(100vw - #{$borderize-margin})
  max-width: 1366px
  overflow: auto

  @media (min-width: 768px)
    width: calc(100vw - #{$borderize-margin * 2})



.headline-title
  margin: 25px 0
  font-family: pacifico, sans-serif

  @media (min-width: 768px)
    margin: 25px 0


  @media (min-width: 1200px)
    margin: 50px 0


  h1
    font-size: 18px

    @media (min-width: 768px)
      font-size: 24px


    @media (min-width: 1200px)
      font-size: 30px
</style>
