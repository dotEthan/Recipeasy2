<script setup lang="ts"></script>

<template>
  <div class="new-container">
    <button class="btn new-recipe" @click="$emit('addNewRecipe')">+</button>
    <div class="recipe-title">
      <h5>New Recipe</h5>
    </div>
  </div>
</template>
<style lang="sass" scoped>
.new-container
  cursor: pointer
</style>
