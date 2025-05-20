<script setup lang="ts">
/**
 * Component used in recipe details for each recipe tag
 * @todo click to search by tag?
 * @example
 *  <TagItemComponent
      v-for="(tag, index) of selectedRecipe?.tags"
      :key="index"
      :tag="tag"
    />
 */
defineProps({
  tag: String
});
</script>

<template>
  <div class="item-list">
    <div class="item-contain">
      <ul class="items-list">
        <li class="direction-contain">
          <div class="text direction-text">- {{ tag }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="sass" scoped>

.direction-contain
  list-style-type: none

.direction-text
  margin-bottom: 10px
</style>
