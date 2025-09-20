<script setup lang="ts">
/**
 * Button for Closing any element requiring it
 * @todo - add placement props
 * @example
 * <XToCloseComponent class="close-button" @close="onClose" />
 */
defineEmits(["close"]);
</script>

<template>
  <button
    type="button"
    class="absolute! top-2! left-2! flex! items-center! justify-center! rounded-full! z-99! cursor-pointer! bg-primary! border-3! border-solid! border-accent! close-container"
    aria-label="Close"
    @click="$emit('close')">
    <span class="close-x" aria-hidden="true">&times;</span>
  </button>
</template>

<style lang="sass">
@use '@/assets/variables' as *

.close-container
    width: 30px
    height: 30px
    box-shadow: 0 1px 3px 1px #ccc
    // background-color: #eef
    // border: 2px solid $colorHighlightBorder

    &:hover
        background-color: #ccc
        border: 2px solid $colorHighlightBorderHover

.close-x
  font-size: 28px
</style>
