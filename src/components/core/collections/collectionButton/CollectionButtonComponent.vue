<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

defineProps({ direction: { type: String, default: "left" } });
defineEmits(["click"]);
</script>

<template>
  <div
    class="rounded-full border-1 border-solid border-black h-20 w-20 bg-black opacity-50 flex justify-center items-center cursor-pointer"
    @click="$emit('click')">
    <div>
      <ChevronLeft color="white" :size="60" v-if="direction === 'left'" />
      <ChevronRight color="white" :size="60" v-if="direction === 'right'" />
    </div>
  </div>
</template>
