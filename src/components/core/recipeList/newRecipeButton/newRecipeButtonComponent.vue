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
.new-container
  cursor: pointer
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center

.new-recipe
  display: flex
  justify-content: center
  align-items: center
  padding: v-bind('btnPadding')
  color: #aaa
  border-radius: 8px
  transition: all .3s
  cursor: pointer
  aspect-ratio: 1/1

  &:hover
    color: #666

.recipe-title-sm
  font-size: clamp(10px, 1.5vw, 15px)
</style>
