<script setup lang="ts">
/**
 * Component for display each item in the recipe collection
 * @example
 * <CollectionItemComponent
    v-for="recipe in recipeData"
    :key="recipe._id.toString()"
    @click="() => openRecipeDetails(recipe._id)"
    :recipeData="recipe"
  />
 */
import type { PropType } from "vue";

import type { Recipe } from "@/types/Recipes";

defineProps({
  recipeData: Object as PropType<Recipe>
});
</script>

<template>
  <div class="recipeitem-container">
    <div class="recipeicon">
      <img :src="recipeData?.imgPath" alt="Logo" />
    </div>
    <span :title="recipeData?.name" class="recipe-title">{{ recipeData?.name }}</span>
    <span class="rating-text">rating: {{ recipeData?.ratings?.averageRating }}</span>
  </div>
</template>

<style lang="sass" scoped>
.recipeitem-container
  display: flex
  flex-direction: column
  width: 100%

.recipeicon
  padding: 5px

  @media (min-width: 768px)
    padding: 15px

  img
    width: 100%
    height: 100%
    object-fit: cover
    object-position: center
    aspect-ratio: 1 / 1

.rating-text
  font-size: 0.7em
</style>
