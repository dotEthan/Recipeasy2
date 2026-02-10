<script setup lang="ts">
/**
 * reusable base for all modals
 * @example
 *  <AppModalComponent :xToClose="true" :backdrop="true">
 */
import { useAppStore } from "@/stores/appStore";

import XToCloseComponent from "../../shared/xToClose/XToCloseComponent.vue";

defineProps({
  xToClose: {
    type: Boolean,
    default: false
  },
  backdrop: {
    type: Boolean,
    default: false
  }
});

const appStore = useAppStore();
const emit = defineEmits(["close"]);

function onClose() {
  appStore.setAuthModalType("");
  emit("close");
}
</script>

<template>
  <div
    class="fixed top-0 left-0 w-screen h-dvh flex justify-center items-center pointer-events-none modal-contain z-30">
    <div
      class="absolute top-0 left-0 w-full h-full pointer-events-auto bg-black opacity-70"
      v-if="backdrop"
      @click="onClose"></div>
    <div
      class="relative max-w-[90vw] min-w-[50vw] lg:min-w-[30vw] max-h-[90vw] overflow-auto pointer-events-auto rounded-lg bg-[var(--color-primary)]">
      <dialog open class="relative m-0 p-6 border-0 bg-transparent w-auto max-w-full">
        <slot></slot>
      </dialog>
      <XToCloseComponent class="absolute top-2 r-3 z-31" @close="onClose" v-if="xToClose" />
    </div>
  </div>
</template>

<style lang="sass" scoped></style>
