import { defineStore } from "pinia";

import { ref } from "vue";

import { TOAST_DURATION } from "@/constants";
import type { ToastAction, ToastQueue, ToastStore, ToastType } from "@/types/Toasts";
import { ErrorHandlerOptions } from "@/types/errors";

export const useToastStore = defineStore("toast", (): ToastStore => {
  // State
  const toastQueue = ref<ToastQueue[]>([]);
  const activeTimeouts = new Map<number, ReturnType<typeof setTimeout>>();
  const startTimes = new Map<number, number>();

  // Getters

  // Actions
  function addToast(
    message: string,
    type: ToastType,
    config?: {
      duration?: number;
      options?: ErrorHandlerOptions;
    }
  ) {
    const id = Date.now();
    const toast: ToastQueue = { id, message, type, ...config };

    if (config?.duration) {
      toast.remaining = config.duration;
    }

    toastQueue.value.push(toast);

    if (config?.duration && toastQueue.value.length === 1) {
      startToastTimer(toast);
    }
  }

  function startToastTimer(toast: ToastQueue) {
    startTimes.set(toast.id, Date.now());

    const timeoutId = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration);
    toast.timeoutId = timeoutId as unknown as number;
    activeTimeouts.set(toast.id, timeoutId);
  }

  function removeToast(id: number) {
    clearTimeout(activeTimeouts.get(id));
    activeTimeouts.delete(id);
    startTimes.delete(id);
    toastQueue.value = toastQueue.value.filter((toast) => toast.id !== id);

    if (toastQueue.value.length > 0) {
      startToastTimer(toastQueue.value[0]);
    }
  }

  function pauseTimer(id: number) {
    const activeToast = toastQueue.value.find((toast) => toast.id === id);
    if (!activeToast || activeToast.duration == null || !startTimes.has(id)) return;

    const startTime = startTimes.get(id);
    if (startTime === undefined) return;

    clearTimeout(activeTimeouts.get(id));
    activeTimeouts.delete(id);

    const elapsed = Date.now() - startTime;
    activeToast.remaining = activeToast.duration! - elapsed;
    startTimes.delete(id);
  }

  function resumeTimer(id: number) {
    const activeToast = toastQueue.value.find((toast) => toast.id === id);
    if (!activeToast?.remaining || activeToast.duration == null) return;

    startTimes.set(id, Date.now());
    const timeoutId = setTimeout(() => {
      removeToast(id);
    }, activeToast.remaining);

    activeTimeouts.set(id, timeoutId);
    delete activeToast.remaining;
  }

  return {
    toastQueue,
    addToast,
    startToastTimer,
    removeToast,
    pauseTimer,
    resumeTimer
  };
});
