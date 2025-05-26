export interface ModalStore {
  currentError: Ref<ErrorModalConfig | null>;
  showCriticalError: (config: Omit<ErrorModalConfig, "id">) => void;
  hideCriticalError: () => void;
  handleRetry: () => Promise<void>;
  handleCancel: () => Promise<void>;
  handleCancelNoRevert: () => Promise<void>;
  handleReport: () => Promise<void>;
}

export interface ErrorModalConfig {
  id: number;
  message: string;
  errorCode?: string;
  showRetry?: boolean;
  showCancel?: boolean;
  showCancelNoRevert?: boolean;
  showReport?: boolean;
  onRetry?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onCancelNoRevert?: () => void | Promise<void>;
  onReport?: () => void | Promise<void>;
  context?: any;
}
