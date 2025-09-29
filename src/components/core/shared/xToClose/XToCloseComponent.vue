<script setup lang="ts">
import { PropType, computed } from "vue";

/**
 * Button for Closing any element requiring it
 * @todo - add placement props
 * @example
 * <XToCloseComponent class="close-button" @close="onClose" />
 */

type Position = "top" | "bottom" | "left" | "right";

const props = defineProps({
  position: {
    type: Array as PropType<Position[]>,
    default: () => ["top", "left"]
  }
});
defineEmits(["close"]);

const positionClasses = computed(() => {
  const classes = ["absolute", "z-40"];

  if (props.position.includes("top")) classes.push("top-2");
  if (props.position.includes("bottom")) classes.push("-bottom-2");
  if (props.position.includes("left")) classes.push("left-2");
  if (props.position.includes("right")) classes.push("-right-2");

  return classes.join(" ");
});
</script>

<template>
  <button
    type="button"
    :class="[
      positionClasses,
      'absolute! flex! items-center! justify-center! rounded-full! z-40 cursor-pointer! bg-surface! text-primary! border-3! border-solid! border-accent! close-container translate-[50%]'
    ]"
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
</style>
