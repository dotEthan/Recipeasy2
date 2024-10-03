<script setup lang="ts">
import type { PropType } from 'vue'
import type { Recipe } from '@/types/Recipes'
const props = defineProps({
  recipeData: Object as PropType<Recipe>
})
console.log(props.recipeData?.imgPath)
</script>

<template>
  <div class="recipeitem-container">
    <div class="recipeicon">
      <img :src="recipeData?.imgPath" alt="Logo" />
    </div>
    <span class="recipe-title">{{ recipeData?.name }}</span>
    <span class="rating-text">rating: {{ recipeData?.rating }}</span>
  </div>
</template>

<style lang="sass">
// @import '../../../assets/variables.sass'
.recipeitem-container
  display: flex
  flex-direction: column

.recipeicon
  padding: 5px

  img
    background-size: contain
    width: 90px
    height: 90px
    border-radius: 5px

.rating-text
  font-size: 0.7em

.recipe-title
  font-size: 1em
</style>
