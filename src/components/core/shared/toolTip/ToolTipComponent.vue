<script setup lang="ts">
/**
 * Add Tooltip
 * @example
 * <ToolTipComponent :content="formError" format="warning" class="tooltip" />
 */
defineProps({
  format: String,
  content: String
});
</script>

<template>
  <div class="tooltip-container">
    <div class="tooltip-content" :class="{ warning: format === 'warning' }">
      <span>{{ content }}</span>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *

.tooltip-container
  position: relative


.tooltip-content
  position: absolute
  top: 100%
  left: 0
  width: auto
  margin-top: 4px
  padding: 12px
  background: $colorLighter
  border-radius: 4px
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05)

  &.warning
    background: $colorWarning
</style>
