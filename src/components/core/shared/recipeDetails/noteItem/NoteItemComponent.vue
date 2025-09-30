<script setup lang="ts">
/**
 * Component used to display each recipe note in recipe details
 * @example
 *  <NoteItemComponent v-for="(note, index) of selectedRecipe?.notes" :key="index" :note="note" />
 */
defineProps({
  note: String
});
</script>

<template>
  <div class="">
    <ul class="">
      <li class="list-none bg-accent/10 border-l-4 border-l-solid border-l-accent p-4 mb-4">
        {{ note }}
      </li>
    </ul>
  </div>
</template>
