import { defineStore } from "pinia";

import { ref } from "vue";

import { DEFAULT_TOAST_DURATION, DEFAULT_TOAST_MAX_RETRY } from "@/constants";
import type { ToastQueue, ToastStore, ToastType } from "@/types/Toasts";
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
    config: {
      duration?: number;
      isPersistent: boolean;
      options?: ErrorHandlerOptions;
    }
  ) {
    const existingToast: ToastQueue | undefined = toastQueue.value.find(
      (toast) => config.options?.context?.actionId === toast.options?.context?.actionId
    );

    if (!existingToast) {
      const id = Date.now();

      if (!config?.isPersistent && !config?.duration) {
        config.duration = DEFAULT_TOAST_DURATION;
      }

      const toast: ToastQueue = {
        id,
        message,
        type,
        ...config,
        maxRetries: config.options?.context?.maxRetries || DEFAULT_TOAST_MAX_RETRY,
        retry: 0
      };
      toastQueue.value.push(toast);

      if (!config.isPersistent) {
        startToastTimer(toast);
      }
    } else {
      // update exsiting toast
      existingToast.retry++;
      if (existingToast.retry >= existingToast.maxRetries) {
        existingToast.options ??= {};
        existingToast.options.btnOptions ??= {};
        existingToast.options.btnOptions.showCreate = true;
      }
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
