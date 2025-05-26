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
  <div class="modal-contain">
    <div class="backdrop" v-if="backdrop" @click="onClose"></div>
    <div class="modal-wrapper">
      <dialog open class="modal">
        <slot></slot>
      </dialog>
      <XToCloseComponent class="close-button" @close="onClose" v-if="xToClose" />
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *

.modal-contain
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  display: flex
  justify-content: center
  align-items: center
  pointer-events: none
  z-index: 1000

  .backdrop
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0, 0, 0, 0.8)
    pointer-events: auto


  .modal-wrapper
    position: relative
    pointer-events: auto
    max-width: 90vw
    max-height: 90vh
    overflow: auto
    background: white
    border-radius: .5em
    min-width: 50vw

    @media (min-width: 768px)
      min-width: 50vw

    @media (min-width: 1200px)
      min-width: 30vw


  .modal
    position: relative
    margin: 0
    padding: 25px
    border: none
    background: transparent
    width: auto
    max-width: 100%


  .close-button
    position: absolute
    top: 10px
    right: 10px
    z-index: 1001
</style>
