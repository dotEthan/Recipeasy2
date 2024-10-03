<script setup lang="ts">
import type { PropType } from 'vue'
import type { Recipe } from '@/types/Recipes'
defineProps({
  recipeData: Object as PropType<Recipe>
})
</script>

<template>
  <div class="recipeItem">
    <a style="cursor: pointer" class="recipeItem-contain">
      <img class="recipe-image" :src="recipeData?.imgPath" />
      <div class="recipe-title">
        <h5>{{ recipeData?.name }}</h5>
      </div>
    </a>
  </div>
</template>

<style lang="sass">
.recipeItem
  width: 100px

  @media (min-width: 768px)
    width: 125px

.recipeItem-contain
  display: flex
  flex-direction: column
  align-items: center

.recipe-image
  width: 75px
  height: 75px
  object-fit: cover
  object-position: center
  border-radius: 5px

  @media (min-width: 768px)
    width: 100px
    height: 100px

.recipe-title
  height: 30px
  text-align: center
  margin: 10px 0
  color: #223

  h5
    font-size: 1rem

    @media (min-width: 768px)
      font-size: 1.2rem
</style>
