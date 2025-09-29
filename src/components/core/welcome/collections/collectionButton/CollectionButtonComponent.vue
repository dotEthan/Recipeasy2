<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

defineProps({ direction: { type: String, default: "left" } });
defineEmits(["click"]);
</script>

<template>
  <button
    class="rounded-full border-2 border-solid border-surface h-15 w-15 bg-primary flex justify-center items-center cursor-pointer hover:border-primary hover:bg-surface active:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-grey disabled:cursor-default"
    @click="$emit('click')"
    :aria-label="`Scroll ${direction}`">
    <div>
      <ChevronLeft color="#f0c125" :size="55" v-if="direction === 'left'" />
      <ChevronRight color="#f0c125" :size="55" v-if="direction === 'right'" />
    </div>
  </button>
</template>
