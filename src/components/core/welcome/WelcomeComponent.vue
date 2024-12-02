<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import CollectionComponent from '../collections/CollectionComponent.vue'
import { useRecipeStore } from '@/stores/recipe'
import { computed, ref } from 'vue'
// import { storeToRefs } from 'pinia'

const recipeStore = useRecipeStore()
// const { recipes } = storeToRefs(recipeStore)
// console.log(recipes.value[0])
const currentTime = ref(new Date())

const mealTime = computed(() => {
  const hours = currentTime.value.getHours()
  console.log(hours)
  if (hours >= 2 && hours < 10) {
    return 'Breakfast'
  } else if (hours >= 10 && hours < 16) {
    return 'Lunch'
  } else {
    return 'Dinner'
  }
})

function mealTimeRecipes() {
  console.log('it is: ', mealTime.value)
  return recipeStore.useFilteredRecipes([mealTime.value]).value.slice(4)
}

function recommendedRecipes() {
  return recipeStore.getNRandomRecipes(5)
}
</script>

<template>
  <div class="base-container welcome">
    <h1>What's for Supper?</h1>
    <div class="searchbar">
      <input type="text" class="searchbar" placeholder="Burritos" />
      <button><Search class="magnifying" :size="20" /></button>
    </div>
    <CollectionComponent title="Recommended" :recipeData="recommendedRecipes()" />
    <CollectionComponent :title="mealTime" :recipeData="mealTimeRecipes()" />
    <CollectionComponent title="Snacks" :recipeData="recipeStore.recipes" />
    <CollectionComponent title="Desserts" :recipeData="recipeStore.recipes" />
    <CollectionComponent title="Healthy Foods" :recipeData="recipeStore.recipes" />
    <CollectionComponent title="Quick Recipes" :recipeData="recipeStore.recipes" />
  </div>
</template>

<style lang="sass">
@import '../../../assets/variables.sass'

.welcome
  height: calc(80vh - $navbar-height)
  margin-top: 10vh
  overflow-y: scroll

.searchbar
  width: 80%

  input
    line-height: 2em
    vertical-align: middle


  button
    margin-left: 10px
    line-height: 2em
    vertical-align: middle


  .magnifying
    display: flex
    align-items: center
</style>
