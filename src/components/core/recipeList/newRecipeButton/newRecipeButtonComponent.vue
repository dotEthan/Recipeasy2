<script setup lang="ts">
import { CirclePlus } from 'lucide-vue-next';
</script>

<template>
  <div class="new-container">
    <button class="btn new-recipe" @click="$emit('addNewRecipe')"><CirclePlus :size="30" /></button>
    <span class="recipe-title">
      New Recipe
    </span>
  </div>
</template>
<style lang="sass" scoped>
.new-container
  cursor: pointer

.new-recipe
  display: flex
  justify-content: center
  align-items: center
  width: 75%
  font-size: 4rem
  color: #aaa
  border: 2px solid #aaa
  border-radius: 8px
  transition: all .3s
  cursor: pointer
  aspect-ratio: 1/1

  &:hover
    color: #888
    border: 2px solid #888

  @media (min-width: 768px)
    width: 100px
    height: 100px

</style>
