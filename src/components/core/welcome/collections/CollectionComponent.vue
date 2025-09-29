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
import { type PropType, onMounted, ref } from "vue";

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

const scrollContainer = ref<Element | null>(null);

let canScrollLeft = ref(false);
let canScrollRight = ref(true);

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

const updateScrollPosition = (direction: string) => {
  const el = scrollContainer.value;
  if (el) {
    const scrollAmount = direction === "left" ? -el.clientWidth : el.clientWidth;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }
};

onMounted(() => {
  const el = scrollContainer.value;
  if (el) {
    const updateScrollState = () => {
      canScrollLeft.value = el.scrollLeft > 0;
      canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth;
    };

    el.addEventListener("scroll", updateScrollState);
    updateScrollState(); // Initial state
  }
});
</script>

<template>
  <div class="relative">
    <div class="bg-accent absolute -top-1.5 -left-1.5 w-[75px] h-[75px] rounded-md"></div>
    <div class="bg-accent absolute -top-1.5 -right-1.5 w-[75px] h-[75px] rounded-xl"></div>
    <div class="bg-accent absolute -bottom-1.5 -left-1.5 w-[75px] h-[75px] rounded-2xl"></div>
    <div class="bg-accent absolute -bottom-1.5 -right-1.5 w-[75px] h-[75px] rounded-lg"></div>
    <div
      class="relative flex flex-col mt-2.5 p-8 w-full md:mt-5 pr-10 pl-10 mb-20 bg-surface rounded-lg border-1 border-solid border-accent z-10">
      <h3 class="mt-0 mb-5 text-heading" data-test="mealtime" id="collection-title">
        {{ getTitle() }}:
      </h3>
      <div>
        <div
          ref="scrollContainer"
          class="no-scrollbar overflow-x-auto"
          role="region"
          aria-label="Recipe collection"
          aria-live="polite"
          v-if="recipeData.length > 0">
          <div class="grid grid-rows-2 grid-cols-auto grid-flow-col gap-4 w-max sm:flex">
            <CollectionItemComponent
              class="w-[35vw] sm:w-[20vw] md:w-[15vw] max-w-[240px]"
              v-for="recipe in recipeData"
              :key="recipe._id.toString()"
              @click="() => openRecipeDetails(recipe._id)"
              :recipeData="recipe" />
          </div>
        </div>
        <div v-else>No recipes found using this tag</div>
      </div>
      <div v-if="canScrollLeft" class="absolute -left-8 top-[50%] translate-y-[-50%]">
        <CollectionButtonComponent direction="left" @click="() => updateScrollPosition('left')" />
      </div>
      <div v-if="canScrollRight" class="absolute -right-8 top-[50%] translate-y-[-50%]">
        <CollectionButtonComponent direction="right" @click="() => updateScrollPosition('right')" />
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
