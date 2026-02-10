<script setup lang="ts">
import { Search } from "lucide-vue-next";

import { PropType, computed } from "vue";

const props = defineProps({
  label: String,
  size: {
    type: String as PropType<"sm" | "md" | "lg">,
    default: "md",
    validator: (v: string) => ["sm", "md", "lg"].includes(v)
  },
  hasIcon: {
    type: Boolean,
    default: false
  },
  type: {
    type: String as PropType<"button" | "submit" | "reset">,
    default: "button",
    validator: (v: string) => ["button", "submit", "reset"].includes(v)
  }
});

defineEmits(["click"]);

const disabled = false;
const loading = false;

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "px-3 py-1.5 text-xs";
    case "md":
      return "px-4 py-2 text-sm";
    case "lg":
      return "px-6 py-3 text-base";
    default:
      return "px-4 py-2 text-sm";
  }
});
</script>

<template>
  <button
    :type="type"
    @click="$emit('click', $event)"
    class="bg-accent text-[var(--color-dark-navy)] rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg hover:brightness-105 active:scale-[0.98] active:shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 w-full max-w-fit relative overflow-hidden m-2 lg:m-4 cursor-pointer group"
    :class="[sizeClasses, { 'opacity-50 cursor-not-allowed': disabled || loading }]"
    :disabled="disabled || loading">
    <div class="flex flex-row justify-around items-center p-2">
      <span className="relative block text-center leading-tight text-sm">
        {{ label }}
      </span>
      <Search
        v-if="hasIcon"
        class="scale-90 opacity-70 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" />
    </div>
  </button>
</template>
<style lang="css"></style>
