<script setup lang="ts">
import { ChefHat } from "lucide-vue-next";
import { RouterLink } from "vue-router";

import { useAppStore } from "@/stores/appStore";

const appStore = useAppStore();

function closeMobileMenu() {
  appStore.isMobileMenuOpen = false;
}
</script>

<template>
  <div class="branded-logo flex flex-row font-brand items-center">
    <ChefHat id="chef-hat" class="h-8 md:h-11 w-8 md:w-11 text-accent" />
    <RouterLink class="ml-2 text-3xl md:text-5xl" @click="closeMobileMenu" to="/"
      >Tasty<span class="text-accent">ista</span></RouterLink
    >
  </div>
</template>

<style scoped>
.branded-logo:hover #chef-hat {
  fill: var(--color-accent);
  stroke: #111830;
}
</style>
