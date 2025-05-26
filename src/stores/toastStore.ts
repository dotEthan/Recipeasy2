import { defineStore } from "pinia";

import { ref } from "vue";

import { TOAST_DURATION } from "@/constants";
import type { ToastQueue, ToastStore, ToastType } from "@/types/Toasts";

export const useToastStore = defineStore("toast", (): ToastStore => {
  // State
  const toastQueue = ref<ToastQueue[]>([]);
  const activeTimeouts = new Map<number, ReturnType<typeof setTimeout>>();
  const startTimes = new Map<number, number>();

  // Getters

  // Actions
  function showToast(message: string, type: ToastType, duration: number = TOAST_DURATION) {
    const id = Date.now();
    const currentToast: ToastQueue = { id, message, type, duration, remaining: duration };
    toastQueue.value.push(currentToast);

    if (toastQueue.value.length === 1) {
      startToastTimer(currentToast);
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
    if (!activeToast || !startTimes.has(id)) return;

    const startTime = startTimes.get(id);
    if (startTime === undefined) return;

    clearTimeout(activeTimeouts.get(id));
    activeTimeouts.delete(id);

    const elapsed = Date.now() - startTime;
    activeToast.remaining = activeToast.duration - elapsed;
    startTimes.delete(id);
  }

  function resumeTimer(id: number) {
    const activeToast = toastQueue.value.find((toast) => toast.id === id);
    if (!activeToast?.remaining) return;

    startTimes.set(id, Date.now());
    const timeoutId = setTimeout(() => {
      removeToast(id);
    }, activeToast.remaining);

    activeTimeouts.set(id, timeoutId);
    delete activeToast.remaining;
  }

  return {
    toastQueue,
    showToast,
    startToastTimer,
    removeToast,
    pauseTimer,
    resumeTimer
  };
});
