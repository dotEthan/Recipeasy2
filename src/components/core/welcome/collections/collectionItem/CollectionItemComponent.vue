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
  <div>
    <div class="w-full flex flex-col rounded-md overflow-hidden cursor-pointer">
      <div class="overflow-hidden">
        <img
          :src="
            recipeData?.imgPath ||
            'https://res.cloudinary.com/dotethan/image/upload/v1758641724/Recipeasy/noimageyet.png'
          "
          alt="recipe image"
          class="w-full aspect-square object-cover transition-transform duration-300 scale-110 hover:scale-100"
          v-if="recipeData?.imgPath" />
      </div>
      <div class="h-20 flex flex-col justify-between bg-primary text-surface p-2">
        <div class="text-base " :title="recipeData?.name">{{ recipeData?.name }}</div>
        <div class="text-sm">rating: {{ recipeData?.ratings?.averageRating }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped></style>
