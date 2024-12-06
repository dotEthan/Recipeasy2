<script setup lang="ts">
import type { PropType } from 'vue'
import type { Recipe } from '@/types/Recipes'
const props = defineProps({
  recipeData: Object as PropType<Recipe>
})
</script>

<template>
  <div class="recipeitem-container">
    <div class="recipeicon">
      <img :src="recipeData?.imgPath" alt="Logo" />
    </div>
    <span :title="recipeData?.name" class="recipe-title">{{ recipeData?.name }}</span>
    <span class="rating-text">rating: {{ recipeData?.rating }}</span>
  </div>
</template>

<style lang="sass" scoped>
// @import '../../../assets/variables.sass'
.recipeitem-container
  display: flex
  flex-direction: column
  width: 100%

.recipeicon
  padding: 5px

  img 
    width: 100%
    height: 100%
    object-fit: cover
    object-position: center
    aspect-ratio: 1 / 1

.rating-text
  font-size: 0.7em

</style>
