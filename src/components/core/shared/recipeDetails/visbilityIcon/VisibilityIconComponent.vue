<script setup lang="ts">
import { Globe } from "lucide-vue-next";

import { Recipe } from "@/types/Recipes";

defineProps<{
  selectedRecipe: Recipe | undefined;
}>();
</script>

<template>
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
</template>
