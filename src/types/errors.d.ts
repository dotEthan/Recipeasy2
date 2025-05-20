import { Ref } from "vue";

export interface ErrorStore {
  errors: Ref<ToastError[]>;
  validationErrors: Ref<Record<string, string>>;
  showErrorModal: Ref<boolean>;
  currentModalError: Ref<BaseError | null>;

  handleError(error: unknown): void;
  handleApiError(error: AxiosError<ApiErrorResponse>): void;
  addToastError(error: NonCriticalError): void;
  setValidationErrors(fieldErrors: FieldError): void;
  clearValidationErrors(): void;
  dismissError(id: string): void;
  handleUnauthRedirect(): void;
  //   showCriticalErrorModal(error: CriticalError): void;
  closeErrorModal(): void;
  //   handleModalAction(actionType: CriticalErrorAction): void;
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
  id: string;
  message: string;
  errorCode: string;
  timestamp: Date;
};
