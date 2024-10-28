<script setup lang="ts">
import { ref } from 'vue'
import { useRecipeStore } from '@/stores/recipe'

const recipeStore = useRecipeStore()

let editSelectedRecipe = ref(false)

function onNewRecipe() {
  recipeStore.setSelectedRecipeId('-1')
  editSelectedRecipe.value = true
  console.log('add recipe')
}
</script>

<template>
  <div class="new-container">
    <button class="btn new-recipe" @click="onNewRecipe()">+</button>
    <div class="recipe-title">
      <h5>New Recipe</h5>
    </div>
  </div>
</template>
