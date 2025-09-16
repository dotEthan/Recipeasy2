import { Ref } from "vue";

interface ErrorStore {
  toastErrors: Ref<ToastError[]>;
  currentModalError: Ref<ErrorModalConfig | null>;
  validationErrors: Ref<Record<string, string>>;

  showCriticalErrorModal: (config: Omit<ErrorModalConfig, "id">) => void;
  hideCriticalErrorModal: () => void;
  addToastError: (error: ToastError, persistent: boolean, options?: ErrorHandlerOptions) => void;
}

interface ErrorHandlerOptions {
  btnOptions?: {
    showRetry?: boolean;
    showCancel?: boolean;
    showCancelNoRevert?: boolean;
    showReport?: boolean;
    onRetry?: () => void | Promise<unknown>;
    onCancel?: () => void | Promise<void>;
    onCancelNoRevert?: () => void | Promise<void>;
    onReport?: () => void | Promise<void>;
  };
  context?: any;
}

export interface SignatureError {
  code: string;
  message: string;
  details?: string;
}

export interface CriticalErrorAction {
  label: string;
  action: string;
}

export interface ErrorDetails {
  [key: string]: unknown;
  fieldErrors?: FieldError;
  component?: string;
  originalError?: unknown;
  actions?: CriticalErrorAction[];
}

export type FieldError = Record<string, string>;

export type ToastError = {
  id: number;
  message: string;
  errorCode: string;
  timestamp: Date;
};
