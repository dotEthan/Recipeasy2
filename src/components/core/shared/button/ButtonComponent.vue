<script setup lang="ts">
defineProps<{
  label: string;
  size: "sm" | "md" | "lg";
}>();
defineEmits(["click"]);
</script>

<template>
  <button
    @click="$emit('click')"
    class="bg-accent text-[var(--color-dark-navy)] w-30 h-12 p-2 rounded-sm text-sm cursor-pointer">
    {{ label }}
  </button>
</template>
