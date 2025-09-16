<script setup lang="ts">
/**
 * Toast connected to toastStore for displaying non-critical user notifications
 * @todo style properly
 * @example
 * <Toast
      v-for="toast in toastStore.toastQueue"
      :key="toast.id"
      :toast="toast"
      @close="toastStore.removeToast(toast.id)"
      @pause="toastStore.pauseTimer(toast.id)"
      @resume="toastStore.resumeTimer(toast.id)"
    />
 */
import { computed } from "vue";

import type { ToastQueue } from "@/types/Toasts";

const BUTTON_MAP = [
  { key: "retry", label: "Retry", show: "showRetry", handler: "onRetry" },
  { key: "cancel", label: "Cancel", show: "showCancel", handler: "onCancel" },
  {
    key: "cancelNoRevert",
    label: "Cancel",
    show: "showCancelNoRevert",
    handler: "onCancelNoRevert"
  },
  { key: "report", label: "Report", show: "showReport", handler: "onReport" }
] as const;

const props = defineProps<{
  toast: ToastQueue;
}>();

const emit = defineEmits(["close", "pause", "resume"]);

const isErrorWarning = computed(
  () => props.toast.type === "error" || props.toast.type === "warning"
);
const ariaType = computed(() => (isErrorWarning.value ? "assertive" : "polite"));

const toastStyles = computed(() => ({
  "toast-base": true,
  "toast-error": props.toast.type === "error",
  "toast-warning": props.toast.type === "warning",
  "toast-success": props.toast.type === "success",
  "toast-info": props.toast.type === "info"
}));

const availableButtons = computed(() => {
  const btnOptions = props.toast.options?.btnOptions;
  if (!btnOptions) return [];

  const currentBtns = BUTTON_MAP.filter((btn) => btnOptions[btn.show]).map((btn) => ({
    key: btn.key,
    label: btn.label,
    handler: () => btnOptions[btn.handler]?.()
  }));
  return currentBtns;
});
</script>

<template>
  <div
    :class="toastStyles"
    :aria-type="ariaType"
    :aria-atomic="true"
    @mouseover="emit('pause')"
    @mouseleave="emit('resume')">
    <div class="toast-header">
      <h3 class="toast-title">{{ toast.type.charAt(0).toUpperCase() + toast.type.slice(1) }}</h3>
      <button class="toast-close" @click="emit('close')" aria-label="Close Notifaction">x</button>
    </div>
    <div class="toast-message">
      <p class="toast-message">{{ toast.message }}</p>
    </div>
    <div class="toast-buttons" v-if="toast.duration === undefined">
      <button v-for="button in availableButtons" :key="button.key" @click="button.handler">
        {{ button.label }}
      </button>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.toast-base
  position: relative
  background: white
  border-radius: 6px
  border: 2px solid black
  padding: 12px
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1)
  display: flex
  flex-direction: column
  gap: 4px
  width: 350px
  max-width: 90vw
  margin-bottom: 8px
  animation: toastSlideIn 0.3s ease-out


.toast-header
  display: flex
  justify-content: space-between
  align-items: center


.toast-title
  font-weight: 500
  font-size: 15px
  margin: 0


.toast-error
  border-left: 4px solid #e53e3e
  background-color: #fff5f5


.toast-warning
  border-left: 4px solid #dd6b20
  background-color: #fffaf0


.toast-success
  border-left: 4px solid #38a169
  background-color: #f0fff4


.toast-info
  border-left: 4px solid #3182ce
  background-color: #ebf8ff


.toast-description
  font-size: 13px
  color: #666
  margin: 0


.toast-close
  background: none
  border: none
  cursor: pointer
  font-size: 16px
  padding: 0
  color: inherit


@keyframes toastSlideIn
  from
    transform: translateY(20px)
    opacity: 0

  to
    transform: translateY(0)
    opacity: 1
</style>
