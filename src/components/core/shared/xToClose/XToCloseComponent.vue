<script setup lang="ts">
defineEmits(['close'])
</script>

<template>
    <button type="button" class="close-container" aria-label="Close" @click="$emit('close')">
      <span class="close-x" aria-hidden="true">&times;</span>
    </button>
</template>

<style lang="sass">
@use '@/assets/variables' as *

.close-container
    position: absolute
    top: -10px
    right: -10px
    display: flex
    align-items: center
    justify-content: center
    width: 30px
    height: 30px
    box-shadow: 0 1px 3px 1px #ccc
    background-color: #eef
    z-index: 99
    border-radius: 50%
    border: 2px solid $colorHighlightBorder
    cursor: pointer
    text-align: center

    &:hover
        background-color: #ccc
        border: 2px solid $colorHighlightBorderHover

.close-x
  font-size: 28px
</style>