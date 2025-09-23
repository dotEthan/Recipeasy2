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

import CollectionButtonComponent from "./collectionButton/CollectionButtonComponent.vue";
import CollectionItemComponent from "./collectionItem/CollectionItemComponent.vue";

const props = defineProps({
  title: String,
  recipeData: {
    type: Array as PropType<Recipe[]>,
    default: () => []
  },
  collectionKey: Number
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

const scrollRight = () => {
  const container = document.getElementById(`collectionItemComponent-${props.collectionKey}`);
  if (container) container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
};

const scrollLeft = () => {
  const container = document.getElementById(`collectionItemComponent-${props.collectionKey}`);
  if (container) container.scrollBy({ left: -container.clientWidth, behavior: "smooth" });
};
</script>

<template>
  <div class="relative">
    <!-- <div class="tl-gradient absolute -top-2 -left-2 w-[100px] h-[100px] rounded-md"></div>
    <div class="tr-gradient absolute -top-2 -right-2 w-[100px] h-[100px] rounded-xl"></div>
    <div class="bl-gradient absolute -bottom-2 -left-2 w-[100px] h-[100px] rounded-2xl"></div>
    <div class="br-gradient absolute -bottom-2 -right-2 w-[100px] h-[100px] rounded-lg"></div> -->
    <div class="bg-accent absolute -top-1.5 -left-1.5 w-[75px] h-[75px] rounded-md"></div>
    <div class="bg-accent absolute -top-1.5 -right-1.5 w-[75px] h-[75px] rounded-xl"></div>
    <div class="bg-accent absolute -bottom-1.5 -left-1.5 w-[75px] h-[75px] rounded-2xl"></div>
    <div class="bg-accent absolute -bottom-1.5 -right-1.5 w-[75px] h-[75px] rounded-lg"></div>
    <div
      class="relative flex flex-col mt-2.5 p-8 w-full md:mt-5 pr-3.5 prl-3.5 mb-20 bg-surface rounded-lg border-1 border-solid border-accent z-2">
      <h3 class="mt-0 mb-5 text-heading" data-test="mealtime" id="collection-title">
        {{ getTitle() }}:
      </h3>
      <div
        :id="`collectionItemComponent-${collectionKey}`"
        class="w-full grid grid-rows-2 md:flex gap-6 grid-flow-col overflow-x-hidden auto-cols-max justify-start"
        v-if="recipeData.length > 0">
        <CollectionItemComponent
          class="flex-shrink-0 w-[18%]"
          v-for="recipe in recipeData"
          :key="recipe._id.toString()"
          @click="() => openRecipeDetails(recipe._id)"
          :recipeData="recipe" />
      </div>
      <div v-else>No recipes found using this tag</div>
      <div class="absolute -right-8 top-[50%] translate-y-[-50%]">
        <CollectionButtonComponent direction="right" @click="scrollRight" />
      </div>
      <div class="absolute -left-8 top-[50%] translate-y-[-50%]">
        <CollectionButtonComponent direction="left" @click="scrollLeft" />
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.tl-gradient
  background: linear-gradient(135deg, var(--color-accent), transparent 50%)
.tr-gradient
  background: linear-gradient(-135deg, var(--color-accent), transparent 50%)
.bl-gradient
  background: linear-gradient(45deg, var(--color-accent), transparent 50%)
.br-gradient
  background: linear-gradient(-45deg, var(--color-accent), transparent 50%)
</style>
