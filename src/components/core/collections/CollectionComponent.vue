<script setup lang="ts">
import type { PropType } from 'vue'
import RecipeItemComponent from '../RecipeItemComponent/RecipeItemComponent.vue'
import type { Recipe } from '@/types/Recipes'

defineProps({
  title: String,
  recipeData: Array as PropType<Recipe[]>
})
</script>

<template>
  <div class="collection-container">
    <h3>{{ title }}</h3>
    <div class="collection-container">
      <RecipeItemComponent v-for="recipe in recipeData" :key="recipe.id" :recipeData="recipe" />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../assets/variables.scss';
.collection-container {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding: 15px;
  width: 100%;

  h3 {
    margin-top: 0;
    margin-bottom: 15px;
  }
}

.collection-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 10px;
}
</style>
