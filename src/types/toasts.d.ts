import { Ref } from "vue";

export interface ToastStore {
  toastQueue: Ref<ToastQueue[]>;

  showToast(message: string, type: ToastType, duration?: number): void;
  startToastTimer(toast: ToastQueue): void;
  removeToast(id: number): void;
  pauseTimer(id: number): void;
  resumeTimer(id: number): void;
}

export type ToastQueue = {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
  remaining?: number;
  timeoutId?: number;
};

export const ToastType = {
  ERROR: "error",
  SUCCESS: "success",
  WARNING: "warning",
  INFO: "info"
} as const;

export type ToastType = (typeof ToastType)[keyof typeof ToastType];
