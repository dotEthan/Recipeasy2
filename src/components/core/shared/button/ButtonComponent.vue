<script setup lang="ts">
import { Search } from "lucide-vue-next";

defineProps<{
  label: string;
  size: "sm" | "md" | "lg";
  hasIcon: boolean;
}>();
defineEmits(["click"]);

const handleClick = () => {
  console.log("hi");
};
</script>

<template>
  <button
    :click="{ handleClick }"
    class="recipe-button bg-accent text-[var(--color-dark-navy)] rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg hover:brightness-105 active:scale-[0.98] active:shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 w-full max-w-fit relative overflow-hidden m-2 lg:m-4 cursor-pointer group">
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
<style lang="css">
.recipe-button::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.recipe-button:hover::before {
  opacity: 1;
}
</style>
