<script setup lang="ts">
import { PropType} from 'vue';
import type { Recipe } from '@/types/Recipes'

defineProps({
  selectedRecipe: Object as PropType<Recipe>
})

</script>

<template>
    <div class="recipe-header">
          <div class="recipe-image-contain">
            <img :src="selectedRecipe?.imgPath" class="recipe-image-bg" />
            <div class="recipe-name">
              <h3>{{ selectedRecipe?.name }}</h3>
            </div>
          </div>
          <div class="recipe-description">
            <div class="description-box">
              <h4 class="recipe-description-title">Description:</h4>
              <p class="recipe-description-text">
                {{ selectedRecipe?.description }}
              </p>
            </div>
            <div class="head-lower-info">
              <div class="ratingbar">
                <div class="ratingbar-left">
                  <div v-if="selectedRecipe?.ratings?.averageRating">
                    <span v-if="selectedRecipe?.ratings?.averageRating">Your Rating:</span>
                    {{ selectedRecipe?.ratings?.averageRating }}
                  </div>
                  <div :class="{smallText: selectedRecipe?.ratings?.averageRating}">
                    <span class="ratingbar-text">Rating: </span>{{ selectedRecipe?.ratings?.averageRating }}
                  </div>
                </div>
                <div class="ratingbar-right"><span class="ratingbar-text">{{ selectedRecipe?.visibility}} </span> </div>
              </div>
              <div class="recipe-url">
                Recipe Url: <a :href="selectedRecipe?.url" rel="noopener noreferrer" target="_blank">{{ selectedRecipe?.url }}</a>
              </div>
            </div>
          </div>
        </div>
</template>
<style lang="sass">
@use '@/assets/variables' as *

.recipe-header
  width: 100%
  min-height: 150px
  display: flex
  flex-direction: column

  @media (min-width: 768px)
    flex-direction: row
    height: 350px


.recipe-image-contain
  position: relative
  display: flex
  width: 100%
  text-align: center

  @media (min-width: 768px)
    width: 50%

.recipe-image-bg
  width: 100%
  min-height: 100px
  object-fit: contain
  object-position: center
  border-radius: 5px
  max-height: 150px
  max-width: 500px
  padding-left: 10px
  padding-right: 10px

  @media (min-width: 768px)
    max-height: 350px
    max-width: 500px
    border-radius: 10px

.recipe-name
  position: absolute
  bottom: 0
  display: flex
  justify-content: center
  align-items: center
  width: 100%
  background-color: rgba(225,225,225,0.8)
  height: 30px
  padding: 0 25px

  @media (min-width: 768px)
    height: 75px

  h4
    margin: 0

.recipe-description
  margin-top: 10px
  display: flex
  flex-direction: column
  justify-content: space-between

  @media (min-width: 768px)
    width: 50%

.recipe-description-title
  margin: 0 5px 5px

  @media (min-width: 768px)
    margin: 0 10px 10px

.recipe-description-text
  padding: 0 10px
  margin: 0
  white-space: pre-wrap

  @media (min-width: 768px)
    padding: 0 20px

.ratingbar
  display: flex
  flex-direction: row
  justify-content: space-between

.ratingbar-text
  font-size: 0.7em

// Radix Switch CSS in Global as required

.Label 
  color: white
  font-size: 15px
  line-height: 1

.recipe-url
  font-size: clamp(8px, 2vw, 12px)
</style>