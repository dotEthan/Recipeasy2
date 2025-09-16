import { defineStore } from "pinia";

import { ref } from "vue";

import { TOAST_DURATION } from "@/constants";
import { TOAST_TYPES } from "@/types";
import { ErrorModalConfig } from "@/types/Modal";
import { ErrorHandlerOptions, ErrorStore, ToastError } from "@/types/errors";

import { useToastStore } from "./toastStore";

export const useErrorStore = defineStore("error", (): ErrorStore => {
  const toastStore = useToastStore();
  // State
  const toastErrors = ref<ToastError[]>([]);
  const currentModalError = ref<ErrorModalConfig | null>(null);
  const validationErrors = ref<Record<string, string>>({});

  let errorIdCounter = 0;

  // Modal actions
  function showCriticalErrorModal(config: Omit<ErrorModalConfig, "id">) {
    const errorConfig: ErrorModalConfig = {
      id: ++errorIdCounter,
      showRetry: false,
      showCancel: false,
      showCancelNoRevert: false,
      showReport: true,
      ...config
    };

    currentModalError.value = errorConfig;
  }

  function hideCriticalErrorModal() {
    currentModalError.value = null;
  }

  // funneling all toast errors through here for future logging
  function addToastError(error: ToastError, persistent: boolean, options?: ErrorHandlerOptions) {
    const errorData = {
      id: String(Date.now()),
      message: error.message,
      errorCode: error.errorCode || "GENERAL",
      timestamp: new Date()
    };

    !persistent
      ? toastStore.addToast(errorData.message, TOAST_TYPES.ERROR, { duration: TOAST_DURATION })
      : toastStore.addToast(errorData.message, TOAST_TYPES.ERROR, { options });

    console.log("Log error to toast");
  }

  return {
    toastErrors,
    currentModalError,
    validationErrors,
    showCriticalErrorModal,
    hideCriticalErrorModal,
    addToastError
  };
});
