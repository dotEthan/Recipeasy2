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
    class="bg-accent text-[var(--color-primary)] w-30 h-15 p-2 rounded-sm text-sm cursor-pointer">
    {{ label }}
  </button>
</template>
