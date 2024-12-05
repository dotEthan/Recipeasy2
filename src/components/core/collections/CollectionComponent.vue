<script setup lang="ts">
import {ref} from 'vue'
import CollectionItemComponent from './collectionItem/CollectionItemComponent.vue'
import RecipeDetailsComponent from '../recipeList/recipeDetails/recipeDetailsComponent.vue';
import type { PropType } from 'vue'
import type { Recipe } from '@/types/Recipes'
import { useRecipeStore } from '@/stores/recipe';

defineProps({
  title: String,
  recipeData: Array as PropType<Recipe[]>
})

const recipeStore = useRecipeStore()

let selectedRecipe = ref<Recipe | undefined>(undefined)
let recipeDetailsOpen = ref(false)


function openRecipeDetails(id: string) {
  if (id !== '') {
    selectedRecipe.value = recipeStore.recipes.find((recipe) => recipe.id === id)
    recipeStore.setSelectedRecipeId(id)
  }
}

function closeRecipeDetails() {
  recipeDetailsOpen.value = false
  selectedRecipe.value = undefined
  recipeStore.setSelectedRecipeId('')
}

</script>

<template>
  <div class="collection-container">
    <h3>{{ title }}:</h3>
    <div class="collection-item-container">
      <CollectionItemComponent @click="() => openRecipeDetails(recipe.id || '')" v-for="recipe in recipeData" :key="recipe.id" :recipeData="recipe" />
    </div>
  </div>
  <div class="recipeDetail-container">
    <RecipeDetailsComponent
      v-if="selectedRecipe"
      @closeRecipeDetails="closeRecipeDetails"
    />
  </div>
</template>

<style lang="sass" scoped>
@import '../../../assets/variables.sass'
.collection-container
  display: flex
  flex-direction: column
  margin-top: 10px
  padding: 10px
  width: 100%

  @media (min-width: 768px)
    margin-top: 20px
    padding: 15px 20px

  h3
    margin-top: 0
    margin-bottom: 15px



.collection-item-container
  width: 100%
  display: grid
  grid-template-columns: 45% 45%
  column-gap: 5px
  row-gap: 10px
  justify-content: space-around
  cursor: pointer

  @media (min-width: 768px)
    grid-template-columns: 19% 19% 19% 19% 19%
    column-gap: 10px
    row-gap: 10px
</style>
