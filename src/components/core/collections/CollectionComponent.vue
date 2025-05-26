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
  const mealTime = recipeStore.getMealTime;
  if (props.title === "What's for ") {
    return `${props.title}${mealTime}`;
  } else {
    return props.title;
  }
};
</script>

<template>
  <div class="collection-container">
    <h3 data-test="mealtime" id="collection-title">{{ getTitle() }}:</h3>
    <div>
      <div class="collection-item-container" v-if="recipeData.length > 0">
        <CollectionItemComponent
          v-for="recipe in recipeData"
          :key="recipe._id.toString()"
          @click="() => openRecipeDetails(recipe._id)"
          :recipeData="recipe" />
      </div>
      <div v-else>No recipes found using this tag</div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *

.collection-container
  display: flex
  flex-direction: column
  margin-top: 10px
  padding: 10px
  width: 100%

  @media (min-width: 768px)
    margin-top: 20px
    padding: 15px 20px

  h3
    margin-top: 0
    margin-bottom: 15px



.collection-item-container
  width: 100%
  display: grid
  grid-template-columns: 45% 45%
  column-gap: 5px
  row-gap: 10px
  justify-content: space-around
  cursor: pointer

  @media (min-width: 768px)
    grid-template-columns: 19% 19% 19% 19% 19%
    column-gap: 10px
    row-gap: 10px
    padding: 15px 50px
</style>
