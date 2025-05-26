import { AxiosError } from "axios";
import { useRouter } from "vue-router";

import { useAuthService } from "@/composables/useAuthService";
import {
  AuthError,
  BaseError,
  CriticalError,
  NonCriticalError,
  PermissionError,
  ValidationError
} from "@/errors";
import { useErrorStore } from "@/stores/errorStore";
import type { ApiErrorResponse } from "@/types/ApiResponse";

interface ErrorHandlerOptions {
  showRetry?: boolean;
  showCancel?: boolean;
  showCancelNoRevert?: boolean;
  showReport?: boolean;
  onRetry?: () => void | Promise<unknown>;
  onCancel?: () => void | Promise<void>;
  onCancelNoRevert?: () => void | Promise<void>;
  onReport?: () => void | Promise<void>;
  context?: any;
}

/**
 * Central error handler - delegates to appropriate handling method
 */
export function handleError(error: unknown, options: ErrorHandlerOptions = {}) {
  // Handle Axios errors first
  if (typeof error === "object" && error instanceof AxiosError) {
    console.log("axios");
    return handleApiError(error, options);
  }

  // Handle custom error instances
  if (error instanceof ValidationError) {
    return handleValidationError(error, options);
  }

  if (error instanceof AuthError) {
    return handleAuthError(error, options);
  }

  if (error instanceof NonCriticalError) {
    return handleNonCriticalError(error);
  }

  if (error instanceof CriticalError) {
    return handleCriticalError(error, options);
  }

  if (error instanceof BaseError) {
    return handleBaseError(error, options);
  }

  // Handle generic JavaScript errors
  return handleGenericError(error, options);
}

/**
 * Handle API/Axios errors - converts to appropriate error types
 */
function handleApiError(error: AxiosError<ApiErrorResponse>, options: ErrorHandlerOptions = {}) {
  const errorStore = useErrorStore();
  console.log("error status", error.response);
  const { status, data } = error.response || {};
  switch (status) {
    case 400:
      if (data?.validationErrors) {
        errorStore.setValidationErrors(data.validationErrors);
      } else {
        errorStore.addToastError({
          id: Date.now(),
          message: data?.message || "Invalid request",
          errorCode: "VALIDATION",
          timestamp: new Date()
        });
      }
      break;

    case 401:
    case 403:
      return handleAuthError(new AuthError(data?.message), options);

    case 404:
      errorStore.addToastError({
        id: Date.now(),
        message: data?.message || "Resource not found",
        errorCode: "NOT_FOUND",
        timestamp: new Date()
      });
      break;

    case 500:
    case 502:
    case 503:
      return handleCriticalError(new CriticalError(data?.message || "Server error"), {
        ...options,
        showRetry: true,
        showReport: true
      });

    default:
      errorStore.addToastError({
        id: Date.now(),
        message: data?.message || "An error occurred",
        errorCode: "UNKNOWN",
        timestamp: new Date()
      });
  }
}

/**
 * Handle validation errors
 */
function handleValidationError(error: ValidationError, options: ErrorHandlerOptions) {
  const errorStore = useErrorStore();

  // Set field errors for forms
  errorStore.setValidationErrors(error.fieldErrors);

  // If there's a retry option, show modal for complex validation
  if (options.onRetry && Object.keys(error.fieldErrors).length > 0) {
    errorStore.showCriticalErrorModal({
      message: error.message,
      errorCode: error.errorCode,
      showRetry: true,
      showCancelNoRevert: !!options.onCancelNoRevert,
      showReport: false,
      onRetry: options.onRetry,
      onCancelNoRevert: options.onCancelNoRevert,
      context: { fieldErrors: error.fieldErrors, ...options.context }
    });
  } else {
    // Simple validation errors as toast
    errorStore.addToastError({
      id: Date.now(),
      message: error.message,
      errorCode: error.errorCode,
      timestamp: new Date()
    });
  }
}

/**
 * Handle authentication errors
 */
function handleAuthError(error: AuthError, options: ErrorHandlerOptions) {
  const errorStore = useErrorStore();
  const authService = useAuthService();
  const router = useRouter();

  if (options.onRetry) {
    // Show modal if retry is possible
    errorStore.showCriticalErrorModal({
      message: error.message,
      errorCode: error.errorCode,
      showRetry: true,
      showCancel: true,
      showReport: false,
      onRetry: options.onRetry,
      onCancel:
        options.onCancel ||
        (() => {
          authService.logOut();
          router.push("/login");
        }),
      context: options.context
    });
  } else {
    // Default auth error handling
    errorStore.addToastError({
      id: Date.now(),
      message: error.message,
      errorCode: error.errorCode,
      timestamp: new Date()
    });

    authService.logOut();
    router.push("/login");
  }
}

/**
 * Handle non-critical errors (always toast)
 */
function handleNonCriticalError(error: NonCriticalError) {
  const errorStore = useErrorStore();

  errorStore.addToastError({
    id: Date.now(),
    message: error.message,
    errorCode: error.errorCode,
    timestamp: new Date()
  });
}

/**
 * Handle critical errors (always modal)
 */
function handleCriticalError(error: CriticalError, options: ErrorHandlerOptions) {
  const errorStore = useErrorStore();

  errorStore.showCriticalErrorModal({
    message: error.message,
    errorCode: error.errorCode,
    showRetry: !!options.onRetry,
    showCancel: !!options.onCancel,
    showCancelNoRevert: !!options.onCancelNoRevert,
    showReport: true,
    onRetry: options.onRetry,
    onCancel: options.onCancel,
    onCancelNoRevert: options.onCancelNoRevert,
    onReport: options.onReport || createDefaultReportHandler(error, options.context),
    context: options.context
  });
}

/**
 * Handle base errors
 */
function handleBaseError(error: BaseError, options: ErrorHandlerOptions) {
  const errorStore = useErrorStore();

  errorStore.showCriticalErrorModal({
    message: error.message,
    errorCode: "UNKNOWN",
    showRetry: !!options.onRetry,
    showCancel: !!options.onCancel,
    showCancelNoRevert: !!options.onCancelNoRevert,
    showReport: true,
    onRetry: options.onRetry,
    onCancel: options.onCancel,
    onCancelNoRevert: options.onCancelNoRevert,
    onReport: options.onReport || createDefaultReportHandler(error, options.context),
    context: options.context
  });
}

/**
 * Handle generic JavaScript errors
 */
function handleGenericError(error: unknown, options: ErrorHandlerOptions) {
  const errorStore = useErrorStore();
  const message = error instanceof Error ? error.message : "An unexpected error occurred";

  errorStore.showCriticalErrorModal({
    message,
    errorCode: "SYSTEM_ERROR",
    showRetry: !!options.onRetry,
    showReport: true,
    onRetry: options.onRetry,
    onReport: options.onReport || createDefaultReportHandler(error, options.context),
    context: options.context
  });
}

/**
 * Create default error reporting handler
 */
function createDefaultReportHandler(error: unknown, context?: any) {
  return async () => {
    const errorStore = useErrorStore();

    try {
      const errorReport = {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        context: context
      };

      console.log("Reporting error:", errorReport);

      // Replace with your actual error reporting API
      // await fetch('/api/errors/report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // });

      errorStore.addToastError({
        id: Date.now(),
        message: "Error reported successfully",
        errorCode: "SUCCESS",
        timestamp: new Date()
      });
    } catch (reportError) {
      console.error("Failed to report error:", reportError);
      errorStore.addToastError({
        id: Date.now(),
        message: "Failed to report error",
        errorCode: "REPORT_FAILED",
        timestamp: new Date()
      });
    }
  };
}
