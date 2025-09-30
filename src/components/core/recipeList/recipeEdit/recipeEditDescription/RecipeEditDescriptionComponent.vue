<script setup lang="ts">
import { computed } from "vue";

const description = defineModel<string>();

const totalDescChars = computed(() => description.value?.length ?? 0);
</script>

<template>
  <div class="form-group">
    <label for="description">Description</label>
    <textarea
      type="text"
      id="description"
      class="form-control recipe-description-area"
      v-model="description"
      rows="6"></textarea>
    <div>{{ totalDescChars }}/256</div>
  </div>
</template>
