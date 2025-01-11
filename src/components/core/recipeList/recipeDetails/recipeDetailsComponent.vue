<script setup lang="ts">
import { useRecipeStore } from '@/stores/recipe'
import ListItemComponent from './listItem/ListItemComponent.vue'
import RecipeDetailHeaderComponent from './recipeDetailHeader/RecipeDetailHeaderComponent.vue';
import RecipeManageButtonsComponent from './recipeManageButtons/RecipeManageButtonsComponent.vue';
import XToCloseComponent from '../../shared/xToClose/XToCloseComponent.vue';
import { useImageUpload } from '@/composables/useImageUpload';

const emit = defineEmits(['closeRecipeDetails', 'removedRecipe', 'editSelectedRecipe'])

const { deleteImage } = useImageUpload()
const recipeStore = useRecipeStore()

const selectedRecipe = recipeStore.getSelectedRecipe

function onClose() {
  emit('closeRecipeDetails')
}

async function deleteRemovedRecipeImage() {
  const imgPath = selectedRecipe?.imgPath
  if (imgPath) {
    console.log('removing image: ', imgPath)
    const success = await deleteImage(imgPath)
    if (!success) {
      console.error('Failed to delete image from Cloudinary')
    }
  }
}
</script>

<template>
  <div class="recipe-detail-container">
    <div class="overlay-shadow" @click="onClose()"></div>
    <div class="recipe-overlay">
      <XToCloseComponent @close="onClose" />
      <div class="overlay-contain">
        <div class="recipe-overlay-content">
          <RecipeDetailHeaderComponent :selectedRecipe="selectedRecipe"/>
          <RecipeManageButtonsComponent @removed-recipe="deleteRemovedRecipeImage"/>
          <div class="ingredients-contain">
            <div class="type-section-title" v-if="selectedRecipe?.ingredients">
              INGREDIENTS: <span class="help-text">(click to add ingredient to shopping list)</span>
            </div>
            <div v-else class="type-section-title">No Ingredients</div>
            <ListItemComponent
              v-for="(ingredient, index) of selectedRecipe?.ingredients"
              :key="index"
              :itemObject="ingredient"
              itemType="ingredient"
            />
          </div>
          <div class="ingredients-contain">
            <div class="type-section-title" v-if="selectedRecipe?.directions">DIRECTIONS:</div>
            <div class="type-section-title" v-else>No Directions</div>
            <ListItemComponent
              v-for="(direction, index) of selectedRecipe?.directions"
              v-bind:key="index"
              :itemObject="direction"
              itemType="direction"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import '@/assets/variables.sass'
.recipe-detail-container
  position: absolute
  top: 0
  left: 0
  width: 100%
  display: flex
  justify-content: center
  align-items: center
  height: calc(100vh - $navbar-height)

.recipe-detail-title
  padding: 5px 0px 5px 10px
  width: 66%
  color: $recipe-text-color
  height: 100%

  @media (min-width: 768px)
    max-width: 66%
    padding: 15px 0px 15px 15px

.recipe-overlay-content
    width: 100%
    height: 100%
    position: relative

.ingredients-contain, .directions-contain
    width: 100%
    color: $recipe-text-color
    padding: 0 5px
    margin-bottom: 15px

    @media (min-width: 768px)
        padding: 0 25px

.help-text
    font-size: .8em

.type-section-title
    margin-bottom: 10px
    font-size: 1.4em

.directions-text, .ingredients-text
    padding: 0 5px

    @media (min-width: 768px)
        padding: 0 10px
</style>
