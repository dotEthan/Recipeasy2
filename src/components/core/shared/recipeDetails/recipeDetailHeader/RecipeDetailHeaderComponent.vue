<script setup lang="ts">
/**
 * Component used to display header for recipe detail page
 * @todo refactor into one componentized button defined by props (type).
 * @example
 *  <RecipeDetailHeaderComponent :selectedRecipe="selectedRecipe" />
 */
import { Clock, CookingPot, ExternalLink, Globe, Shuffle } from "lucide-vue-next";

import { PropType } from "vue";

import type { Recipe } from "@/types/Recipes";

import RecipeDetailHeaderDescComponent from "./recipeDetailHeaderDesc/RecipeDetailHeaderDescComponent.vue";

defineProps({
  selectedRecipe: Object as PropType<Recipe>
});
</script>

<template>
  <div class="flex flex-col md:flex-row max-h-[300px]">
    <div
      class="relative flex w-full text-center md:w-[350px] min-h-[100px] xs:min-h-[175px] md:min-h-[250px] overflow-hidden">
      <img
        class="w-full h-full object-cover"
        :src="
          selectedRecipe?.imgPath ||
          'https://res.cloudinary.com/dotethan/image/upload/v1758641724/Recipeassy/noimageyet.png'
        " />
      <div
        class="absolute bottom-5 right-5 flex flex-col bg-accent rounded-3xl w-[40%] text-xs p-2">
        <div class=""><span class="">Avg: </span>{{ selectedRecipe?.ratings?.averageRating }}</div>
        <div v-if="selectedRecipe?.ratings?.averageRating">
          <span v-if="selectedRecipe?.ratings?.averageRating">Yours:</span>
          {{ selectedRecipe?.ratings?.averageRating }}
        </div>
      </div>
    </div>
    <div
      class="w-full h-full flex flex-col grow content-between p-2 md:pt-8 md:pl-8 md:pr-8 text-base">
      <div class="flex flex-row justify-between">
        <div class="flex flex-col">
          <div class="text-lg md:text-4xl font-bold">{{ selectedRecipe?.name }}</div>
          <div
            v-if="selectedRecipe?.url"
            class="flex flex-row items-center text-surface text-xs md:text-sm md:mt-1">
            <a
              class="flex flex-row text-surface hover:text-accent items-center cursor-pointer"
              :href="selectedRecipe?.url"
              rel="noopener noreferrer"
              target="_blank"
              ><ExternalLink :size="13" /> <span class="ml-2">View Original Recipe</span></a
            >
          </div>
        </div>
        <div
          v-if="selectedRecipe?.visibility === 'public'"
          class="absolute top-2 left-2 md:static flex flex-col items-center justify-center w-fit">
          <Globe color="green" />
          <span class="bg-accent md:bg-transparent rounded-md p-0.5 text-xs mt-1 md:mt-0">{{
            selectedRecipe?.visibility
          }}</span>
        </div>
        <div
          v-if="selectedRecipe?.visibility === 'private'"
          class="absolute top-2 left-2 md:static flex flex-col items-center justify-center w-fit">
          <Globe color="red" />
          {{ selectedRecipe?.visibility }}
        </div>
      </div>
      <RecipeDetailHeaderDescComponent :selectedRecipe="selectedRecipe" />
      <div class="w-full flex flex-col text-xs md:text-sm">
        <div class="w-full flex flex-row flex-wrap">
          <div class="w-1/3"><span class="font-bold">Servings:</span> 9</div>
          <div class="w-1/3"><span class="font-bold">cusine:</span> Italian</div>
          <div class="w-1/3"><span class="font-bold">course:</span> Breakfast</div>
          <div class="w-1/3"><span class="font-bold">Calories:</span> 4500cal</div>
          <div class="w-1/3"><span class="font-bold">Author:</span> Frank Sinatra</div>
        </div>
        <div class="w-full"><span class="font-bold">equipment:</span> blender, stove, magic</div>
        <div class="w-full flex flex-row text-xs mt-4">
          <div class="w-1/3 flex flex-row justify-center items-center">
            <Shuffle class="" /> prep: 30min
          </div>
          <div
            class="w-1/3 flex flex-row justify-center items-center border-l-1 border-accent border-r-1">
            <CookingPot /> cook: 20min
          </div>
          <div class="w-1/3 flex flex-row justify-center items-center"><Clock /> total: 50min</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="sass"></style>
