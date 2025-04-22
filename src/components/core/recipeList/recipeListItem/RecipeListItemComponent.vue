<script setup lang="ts">
import type { PropType } from 'vue'
import type { Recipe } from '@/types/Recipes'
defineProps({
  recipeData: Object as PropType<Recipe>
})
</script>

<template>
  <div class="recipeItem" @click="recipeData?._id ? $emit('openRecipe', recipeData?._id) : console.log('Item not saved, please wait.')">
    <a style="cursor: pointer" class="recipeItem-contain">
      <img class="recipe-image" :class="{ grey: !recipeData?._id }" :src="recipeData?.imgPath" />
      <span class="recipe-title">
        {{ recipeData?.name }}
      </span>
    </a>
  </div>
</template>

<style lang="sass" scoped>
.recipeItem
  width: 100%

.recipeItem-contain
  display: flex
  flex-direction: column
  align-items: center

.recipe-image
  width: 100%
  object-fit: cover
  object-position: center
  border-radius: 5px
  aspect-ratio: 1/1

  .grey
    filter: grayscale(100%)
</style>
