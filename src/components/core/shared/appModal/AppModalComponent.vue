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
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    height: 100%
    margin-top: $navbar-height

.modal-wrapper
    position: relative
    display: flex
    justify-content: center
    align-items: center
    // height: 100%
    max-height: calc(80vh - $navbar-height)

.modal
    background: white
    position: relative
    border-radius: 15px
    width: 80vw
    box-shadow: 2px 3px 10px 1px rgba(0,0,0,.3)
    padding: 50px
    overflow-y: auto
    margin: auto

    @media (min-width: 1024px)
      max-width: 50vw

.backdrop
    position: absolute
    width: 100%
    height: 100%
    // z-index: -10
    background-color: rgba(0,0,0,0.8)
</style>
