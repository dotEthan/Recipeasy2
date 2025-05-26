<script setup lang="ts">
/**
 * toast and modal container
 * @todo add modal
 * @example
 *  <AppOverlays />
 */
import { useErrorStore } from "@/stores/errorStore";
import { useToastStore } from "@/stores/toastStore";

import Toast from "../../shared/toast/ToastComponent.vue";
import ErrorModalComponent from "../errorModal/ErrorModalComponent.vue";

const toastStore = useToastStore();
const errorStore = useErrorStore();
</script>
<template>
  <Teleport to="body">
    <div class="toast-container" v-if="toastStore.toastQueue.length > 0">
      <Toast
        v-for="toast in toastStore.toastQueue"
        :key="toast.id"
        :toast="toast"
        @close="toastStore.removeToast(toast.id)"
        @pause="toastStore.pauseTimer(toast.id)"
        @resume="toastStore.resumeTimer(toast.id)" />
    </div>
  </Teleport>

  <!-- Modals -->
  <Teleport to="body">
    <ErrorModalComponent
      v-if="errorStore.currentModalError"
      v-bind="errorStore.currentModalError.props" />
  </Teleport>
</template>

<style lang="sass" scoped>
.toast-container
  position: fixed
  top: 120px
  left: 50%
  transform: translateX(-50%)
  z-index: 1000
</style>
