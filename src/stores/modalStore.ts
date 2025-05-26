import { defineStore } from "pinia";

import { ref } from "vue";

import { ErrorModalConfig, ModalStore } from "@/types/Modal";

export const useModalStore = defineStore("modal", (): ModalStore => {
  const currentError = ref<ErrorModalConfig | null>(null);
  let errorIdCounter = 0;

  function showCriticalError(config: Omit<ErrorModalConfig, "id">) {
    const errorConfig: ErrorModalConfig = {
      id: ++errorIdCounter,
      showRetry: false,
      showCancel: false,
      showCancelNoRevert: false,
      showReport: true,
      ...config
    };

    currentError.value = errorConfig;
  }

  function hideCriticalError() {
    currentError.value = null;
  }

  async function handleRetry() {
    if (currentError.value?.onRetry) {
      try {
        await currentError.value.onRetry();
        hideCriticalError();
      } catch (error) {
        // If retry fails, keep the modal open or show a new error
        console.error("Retry failed:", error);
      }
    }
  }

  async function handleCancel() {
    if (currentError.value?.onCancel) {
      try {
        await currentError.value.onCancel();
      } catch (error) {
        console.error("Cancel action failed:", error);
      }
    }
    hideCriticalError();
  }

  async function handleCancelNoRevert() {
    if (currentError.value?.onCancelNoRevert) {
      try {
        await currentError.value.onCancelNoRevert();
      } catch (error) {
        console.error("Cancel no revert action failed:", error);
      }
    }
    hideCriticalError();
  }

  async function handleReport() {
    if (currentError.value?.onReport) {
      try {
        await currentError.value.onReport();
      } catch (error) {
        console.error("Report action failed:", error);
      }
    }
  }

  return {
    currentError,
    showCriticalError,
    hideCriticalError,
    handleRetry,
    handleCancel,
    handleCancelNoRevert,
    handleReport
  };
});
