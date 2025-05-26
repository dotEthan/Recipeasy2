import { defineStore } from "pinia";

import { ref } from "vue";

import { TOAST_DURATION } from "@/constants";
import { ErrorModalConfig } from "@/types/Modal";
import { ErrorStore, ToastError } from "@/types/errors";

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

  // Needed for errors that pass through? Or always modal anyway? Test and update
  function addToastError(error: ToastError): string {
    const errorData = {
      id: String(Date.now()),
      message: error.message,
      errorCode: error.errorCode || "GENERAL",
      timestamp: new Date()
    };
    toastStore.showToast(errorData.message, "error", TOAST_DURATION);

    return errorData.id;
  }

  // Validation actions
  function setValidationErrors(errors: Record<string, string>) {
    validationErrors.value = errors;
  }

  function clearValidationErrors() {
    validationErrors.value = {};
  }

  return {
    toastErrors,
    currentModalError,
    validationErrors,
    showCriticalErrorModal,
    hideCriticalErrorModal,
    addToastError,
    setValidationErrors,
    clearValidationErrors
  };
});
