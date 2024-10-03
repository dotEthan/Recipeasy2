<script setup lang="ts">
import type { PropType } from 'vue'
import type { Recipe } from '@/types/Recipes'
defineProps({
  recipeData: Object as PropType<Recipe>
})
</script>

<template>
  <div class="recipeItem">
    Hi
    <!-- <a style="cursor: pointer" class="recipeItem-contain">
      <img class="recipe-image" :src="recipeData?.imgPath" />
      <div class="recipe-title">
        <h5>{{ recipeData?.name }}</h5>
      </div>
    </a> -->
  </div>
</template>
