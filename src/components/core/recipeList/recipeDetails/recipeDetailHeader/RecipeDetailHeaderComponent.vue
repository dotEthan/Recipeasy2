<script setup lang="ts">
import type { Recipe } from '@/types/Recipes'
import { PropType } from 'vue';

defineProps({
  selectedRecipe: Object as PropType<Recipe>
})
</script>

<template>
    <div class="recipe-header">
          <div class="recipe-image-contain">
            <img :src="selectedRecipe?.imgPath" class="recipe-image-bg" />
            <div class="recipe-name">
              <h4>{{ selectedRecipe?.name }}</h4>
            </div>
          </div>
          <div class="recipe-description">
            <h4 class="recipe-description-title">Description:</h4>
            <p class="recipe-description-text">
              {{ selectedRecipe?.description }}
            </p>
          </div>
        </div>
</template>
<style lang="sass" scoped>
@import '@/assets/variables.sass'

.recipe-header
  display: flex
  flex-direction: column
  width: 100%
  min-height: 100px

  @media (min-width: 768px)
    grid-template-areas: "a b" "c c"

.recipe-image-contain
  position: relative
  width: 100%
  height: 100px

.recipe-image-bg
  width: 100%
  min-height: 100px
  object-fit: cover
  object-position: center
  border-radius: 5px
  max-height: 100px
  padding-left: 10px
  padding-right: 10px

  @media (min-width: 768px)
    max-height: 200px
    border-radius: 10px

.recipe-name
  position: absolute
  bottom: 0
  display: flex
  justify-content: center
  align-items: center
  width: 100%
  background-color: rgba(255,255,255,0.9)
  height: 30px

  h4
    margin: 0

.recipe-description
  max-height: 150px
  margin-top: 10px

.recipe-description-title
  margin: 0 5px 5px

  @media (min-width: 768px)
    margin: 0 10px 10px

.recipe-description-text
  padding: 0 10px
  margin: 0

  @media (min-width: 768px)
    padding: 0 20px
</style>