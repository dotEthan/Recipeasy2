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
  <div class="w-45 lg:w-60 flex-shrink-0">
    <div class="w-full flex flex-col rounded-md overflow-hidden cursor-pointer">
      <div>
        <img
          :src="recipeData?.imgPath"
          alt="recipe image"
          class="w-full aspect-square object-cover" />
      </div>
      <div class="h-20 bg-surface text-primary">
        <div :title="recipeData?.name">{{ recipeData?.name }}</div>
        <div class="text-sm">rating: {{ recipeData?.ratings?.averageRating }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped></style>
