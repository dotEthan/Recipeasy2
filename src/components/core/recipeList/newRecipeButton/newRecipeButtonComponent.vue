<script setup lang="ts">
import { CirclePlus } from 'lucide-vue-next';

const props = defineProps({
  iconSize: String,
})

const iconSizeNumber = props.iconSize === 'small' ? 13 : 30
const btnPadding = props.iconSize === 'small' ? '3px' : '20px'
// const btnPadding = props.iconSize === 'small' ? '5px' : '20px'

</script>

<template>
  <div class="new-container">
    <button class="btn new-recipe" @click="$emit('addNewRecipe')"><CirclePlus :size="iconSizeNumber" /></button>
    <span :class="(iconSize === 'small') ? 'recipe-title-sm' : 'recipe-title'">
      New Recipe
    </span>
  </div>
</template>
<style lang="sass" scoped>
@import '@/assets/variables.sass'
.new-container
  cursor: pointer
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  width: 100%

.new-recipe
  display: flex
  justify-content: center
  align-items: center
  padding: v-bind('btnPadding')
  color: $colorMiddle
  border-radius: 8px
  transition: all .3s
  cursor: pointer
  aspect-ratio: 1/1
  border: 2px solid $colorMiddle

  &:hover
    color: $colorDarker
    border: 2px solid $colorDarker
    background-color: $colorLighter

.recipe-title-sm
  font-size: clamp(10px, 1.5vw, 15px)
</style>
