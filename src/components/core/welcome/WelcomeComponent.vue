<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import CollectionComponent from '../collections/CollectionComponent.vue'
import { UseRecipeStore } from '@/stores/recipe'
// import { storeToRefs } from 'pinia'

const recipeStore = UseRecipeStore()
// const { recipes } = storeToRefs(recipeStore)
// console.log(recipes.value[0])
</script>

<template>
  <div class="base-container welcome">
    <h1>What's for Supper?</h1>
    <div class="searchbar">
      <input type="text" class="searchbar" placeholder="Burritos" />
      <button><Search class="magnifying" :size="20" /></button>
    </div>
    <CollectionComponent title="Collections" :recipeData="recipeStore.recipes" />
  </div>
</template>

<style lang="sass">
@import '../../../assets/variables.sass'

.welcome
  height: calc(80vh - $navbar-height)
  margin-top: 10vh


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
