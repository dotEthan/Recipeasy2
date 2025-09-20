<script setup lang="ts">
/**
 * Component for display recipe collections on the welcome page
 * @example
 * <CollectionComponent
    ref="recommended-recipes-collection"
    title="Recommended Public Recipes"
    :recipeData="recommendedRecipes"
  />
 */
import type { PropType } from "vue";

import { useRecipeStore } from "@/stores/recipeStore";
import type { Recipe } from "@/types/Recipes";
import { getMealTime } from "@/utilities";

import CollectionItemComponent from "./collectionItem/CollectionItemComponent.vue";

const props = defineProps({
  title: String,
  recipeData: {
    type: Array as PropType<Recipe[]>,
    default: () => []
  }
});

const recipeStore = useRecipeStore();

function openRecipeDetails(id: string) {
  recipeStore.setSelectedRecipeId(id);
}

const getTitle = () => {
  const mealTime = getMealTime();
  if (props.title === "What's for ") {
    return `${props.title}${mealTime}`;
  } else {
    return props.title;
  }
};
</script>

<template>
  <div class="flex flex-col mt-2.5 p-2.5 w-full md:mt-5 pr-3.5 prl-3.5 pt-5 pb-5">
    <h3 class="mt-0 mb-3.5" data-test="mealtime" id="collection-title">{{ getTitle() }}:</h3>
    <div
      class="w-full grid grid-rows-2 md:flex gap-6 grid-flow-col overflow-x-auto auto-cols-max justify-start"
      v-if="recipeData.length > 0">
      <CollectionItemComponent
        v-for="recipe in recipeData"
        :key="recipe._id.toString()"
        @click="() => openRecipeDetails(recipe._id)"
        :recipeData="recipe" />
    </div>
    <div v-else>No recipes found using this tag</div>
  </div>
</template>

<style lang="sass" scoped></style>
