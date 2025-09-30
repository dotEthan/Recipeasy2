<script setup lang="ts">
import { ref } from "vue";

import { Recipe } from "@/types/Recipes";

defineProps<{
  selectedRecipe: Recipe | undefined;
}>();

const isExpanded = ref(false);
</script>

<template>
  <div class="relative mt-2 mb-2">
    <p class="text-xs md:text-md" :class="{ 'line-clamp-3': !isExpanded }">
      {{ selectedRecipe?.description }}
    </p>
    <button
      @click="isExpanded = !isExpanded"
      class="absolute -bottom-3 right-2 md:right-6 text-xs cursor-pointer">
      {{ isExpanded ? ">Less<" : ">More<" }}
    </button>
  </div>
</template>
