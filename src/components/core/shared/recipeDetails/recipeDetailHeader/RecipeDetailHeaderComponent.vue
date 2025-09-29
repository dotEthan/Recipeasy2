<script setup lang="ts">
/**
 * Component used to display header for recipe detail page
 * @todo refactor into one componentized button defined by props (type).
 * @example
 *  <RecipeDetailHeaderComponent :selectedRecipe="selectedRecipe" />
 */
import { CookingPot, ExternalLink, Globe, Shuffle } from "lucide-vue-next";

import { PropType } from "vue";

import type { Recipe } from "@/types/Recipes";

defineProps({
  selectedRecipe: Object as PropType<Recipe>
});
</script>

<template>
  <div class="flex flex-col md:flex-row min-h-[250px] max-h-[400px]">
    <div class="relative flex w-full text-center md:w-[350px] overflow-hidden">
      <img
        class="w-full h-full object-cover"
        :src="
          selectedRecipe?.imgPath ||
          'https://res.cloudinary.com/dotethan/image/upload/v1758641724/Recipeasy/noimageyet.png'
        " />
      <div class="absolute top-10 right-5 flex-grow bg-accent rounded-full w-[20%] h=4">
        <div v-if="selectedRecipe?.ratings?.averageRating">
          <span v-if="selectedRecipe?.ratings?.averageRating">Your Rating:</span>
          {{ selectedRecipe?.ratings?.averageRating }}
        </div>
        <div :class="{ smallText: selectedRecipe?.ratings?.averageRating }">
          <span class="ratingbar-text">Rating: </span>{{ selectedRecipe?.ratings?.averageRating }}
        </div>
      </div>
    </div>
    <div class="w-full flex flex-col grow content-between p-8 text-base">
      <div class="flex flex-row justify-between">
        <div class="flex flex-col">
          <div class="text-xl md:text-4xl font-bold">{{ selectedRecipe?.name }}</div>
          <div class="flex flex-row items-center text-surface text-2xs md:text-sm mt-1">
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
          class="flex flex-col items-center justify-center w-fit">
          <Globe color="green" />
          {{ selectedRecipe?.visibility }}
        </div>
        <div
          v-if="selectedRecipe?.visibility === 'private'"
          class="flex flex-col items-center justify-center w-fit">
          <Globe color="red" />
          {{ selectedRecipe?.visibility }}
        </div>
      </div>
      <div class="mt-5 mb-5">
        <p class="text-md">
          {{ selectedRecipe?.description }}
        </p>
      </div>
      <div class="w-full flex flex-col">
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
            <Shuffle class="text-sm md:text-lg" /> prep: 30min
          </div>
          <div
            class="w-1/3 flex flex-row justify-center items-center border-l-1 border-accent border-r-1">
            <CookingPot /> cook: 20min
          </div>
          <div class="w-1/3 flex flex-row justify-center items-center">total: 50min</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="sass"></style>
