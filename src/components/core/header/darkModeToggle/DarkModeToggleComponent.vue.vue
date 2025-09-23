<script setup lang="ts">
import { Moon, Store, Sun } from "lucide-vue-next";

import { useAppStore } from "@/stores/appStore";

/**
 * Toggle to switch between things
 * @todo - add icon/type props as reused
 * @example
 * <ToggleButtonComponent @clicked="onClick" />
 */
defineEmits(["clicked"]);

const appStore = useAppStore();
</script>

<template>
  <div
    class="flex items-center justify-center h-6 lg:h-7 w-6 lg:w-7 rounded-full cursor-pointer"
    @click="$emit('clicked')">
    <Moon :size="32" v-if="appStore.lightMode" />
    <Sun color="#f0c125" :size="32" v-if="!appStore.lightMode" />
  </div>
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

.close-x
  font-size: 28px
</style>
