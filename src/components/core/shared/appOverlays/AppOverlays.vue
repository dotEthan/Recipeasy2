<script setup lang="ts">
/**
 * toast and modal container
 * @todo add modal
 * @example
 *  <AppOverlays />
 */
import { useToastStore } from "@/stores/toastStore";

import Toast from "../../shared/toast/ToastComponent.vue";

const toastStore = useToastStore();
// const modalStore = useModalStore();
</script>
<template>
  <Teleport to="body">
    <div class="toast-container">
      <Toast
        v-for="toast in toastStore.toastQueue"
        :key="toast.id"
        :toast="toast"
        @close="toastStore.removeToast(toast.id)"
        @pause="toastStore.pauseTimer(toast.id)"
        @resume="toastStore.resumeTimer(toast.id)"
      />
    </div>
  </Teleport>

  <!-- Modals -->
  <!-- <Teleport to="body">
    <component 
      :is="modalStore.currentModal?.component"
      v-if="modalStore.currentModal"
      v-bind="modalStore.currentModal.props"
    />
  </Teleport> -->
</template>

<style lang="sass" scoped>
.toast-container
  position: fixed
  top: 120px
  left: 50%
  transform: translateX(-50%)
  z-index: 1000
</style>
