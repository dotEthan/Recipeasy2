<script setup lang="ts">
/**
 * Component to display when user has no recipes
 * @todo Create it properly
 * @example
 *  <RecipesEmptyComponent />
 */
import NewRecipeButtonComponent from "../newRecipeButton/newRecipeButtonComponent.vue";
</script>

<template>
  <div class="no-recipes">
    I looked for Recipes and found none. What madness is this? Add a recipe below before you starve!
    <NewRecipeButtonComponent />
  </div>
</template>

<style lang="sass" scoped></style>
