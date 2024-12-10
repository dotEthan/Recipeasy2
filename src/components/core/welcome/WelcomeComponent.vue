<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import CollectionComponent from '../collections/CollectionComponent.vue'
import { useRecipeStore } from '@/stores/recipe'
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import UnsavedDataModalComponent from '@/components/core/shared/unsavedDataModal/UnsavedDataModalComponent.vue';
import RecipeDetailsComponent from '@/components/core/recipeList/recipeDetails/recipeDetailsComponent.vue';
import type { Recipe } from '@/types/Recipes'

const recipeStore = useRecipeStore()
const appStore = useAppStore()
const userStore = useUserStore()
const currentTime = ref(new Date())

let recipeDetailsOpen = ref(false)

const greeting = computed(() => {
  const displayName = userStore.localUser.displayName
  if (displayName) {
    return `Welcome, ${displayName}!` 
  } else {
    return `Welcome!` 
  }
})

const mealTime = computed(() => {
  const hours = currentTime.value.getHours()
  if (hours >= 2 && hours < 10) {
    return 'Breakfast'
  } else if (hours >= 10 && hours < 16) {
    return 'Lunch'
  } else {
    return 'Dinner'
  }
})

function mealTimeRecipes() {
  return recipeStore.useFilteredRecipes([mealTime.value]).value.slice(4)
}

function recommendedRecipes() {
  let numberOfRecipes = 5
  if(appStore.screenSize === 'sm') numberOfRecipes = 6
  return recipeStore.getNRandomRecipes(numberOfRecipes)
}

function handleUserResponse(userResponse: string) {
  console.log(userResponse)
  appStore.showUnsavedChangesModal = false
}

function closeRecipeDetails() {
  recipeDetailsOpen.value = false
  recipeStore.setSelectedRecipeId('')
}
</script>

<template>
  <div class="base-container welcome">
    <h1>{{greeting}}</h1>
    <h2>What's for Supper?</h2>
    <div class="searchbar">
      <input disabled type="text" class="searchbar-input" placeholder="Burritos" />
      <button disabled><Search class="magnifying" :size="15" /></button>
    </div>
    <span style="font-size: 0.7em;">Public Recipes & Search Coming Soon!</span>
    <div class="base-content-container">
      <CollectionComponent title="Recommended Public Recipes" :recipeData="recommendedRecipes()" />
      <CollectionComponent :title="'Ready for ' + mealTime" :recipeData="mealTimeRecipes()" />
      <CollectionComponent title="Snacks" :recipeData="recommendedRecipes()" />
      <CollectionComponent title="Healthy Foods" :recipeData="recommendedRecipes()" />
      <CollectionComponent title="Ethan's Favourites" :recipeData="recommendedRecipes()" />
    </div>
  </div>
  <RecipeDetailsComponent v-if="recipeStore.selectedRecipeId" @closeRecipeDetails="closeRecipeDetails" />
  <UnsavedDataModalComponent v-if="appStore.showUnsavedChangesModal" :close="handleUserResponse('save')"/>
</template>

<style lang="sass" scoped>
@import '../../../assets/variables.sass'

h1
  margin-bottom: 0

h2
  margin: 5px 0

.searchbar
  width: 90%
  display: flex


  .searchbar-input
    line-height: 1em
    vertical-align: middle
    flex-grow: 1

    @media (min-width: 768px)
      line-height: 2em

  button
    margin-left: 10px
    line-height: 2em
    vertical-align: middle
    // background-color: $colorMiddle
    width: 24px
    height: 24px
    border-radius: 5px
    cursor: pointer

  .magnifying
    display: flex
    align-items: center
    // color: white
    width: 100%

  @media (min-width: 768px)
    width: 80%
</style>
