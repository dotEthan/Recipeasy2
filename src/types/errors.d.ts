import { Ref } from "vue";

interface ErrorStore {
  toastErrors: Ref<ToastError[]>;
  currentModalError: Ref<ErrorModalConfig | null>;
  validationErrors: Ref<Record<string, string>>;

  showCriticalErrorModal: (config: Omit<ErrorModalConfig, "id">) => void;
  hideCriticalErrorModal: () => void;
  addToastError: (error: ToastError) => string;
  setValidationErrors: (errors: Record<string, string>) => void;
  clearValidationErrors: () => void;
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
