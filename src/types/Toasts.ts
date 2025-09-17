import { Ref } from "vue";

import { ErrorHandlerOptions } from "./errors";

export interface ToastStore {
  toastQueue: Ref<ToastQueue[]>;

  addToast(
    message: string,
    type: ToastType,
    config: {
      duration?: number;
      isPersistent: boolean;
      options?: ErrorHandlerOptions;
    }
  ): void;
  startToastTimer(toast: ToastQueue): void;
  removeToast(id: number): void;
  pauseTimer(id: number): void;
  resumeTimer(id: number): void;
}

export const TOAST_TYPES = {
  ERROR: "error",
  SUCCESS: "success",
  WARNING: "warning",
  INFO: "info"
} as const;

export const ACTION_VARIANTS = {
  RETRY: "retry",
  CANCEL: "cancel",
  REVERT: "revert",
  REPORT: "report"
} as const;

export type ToastType = (typeof TOAST_TYPES)[keyof typeof TOAST_TYPES];
export type ActionVariant = (typeof ACTION_VARIANTS)[keyof typeof ACTION_VARIANTS];

export type ToastQueue = {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
  remaining?: number;
  timeoutId?: number;
  isPersistent: boolean;
  options?: ErrorHandlerOptions;
  retry: number;
  maxRetries: number;
};

export type ToastAction = {
  label: string;
  handler: () => void;
  variant?: ActionVariant;
};
