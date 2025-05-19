
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
}