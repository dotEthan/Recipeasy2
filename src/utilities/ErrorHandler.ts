import { AuthError, BaseError, CriticalError, NonCriticalError } from "@/errors";
import { useErrorStore } from "@/stores/errorStore";
import { ErrorHandlerOptions } from "@/types/errors";

/**
 * Central error handler - delegates to appropriate handling method
 */
export function handleError(error: unknown, options: ErrorHandlerOptions = {}) {
  const errorStore = useErrorStore();
  console.log("options: ", options);
  console.log("handling error: ", error.name);
  console.log("Error type:", error.constructor.name);

  if (error.name === "AxiosError") {
    switch (error.status) {
      case 404:
        console.log("404s");
        errorStore.addToastError(error, true, options);
    }
  }
  // Handle Axios errors first
  // if (typeof error === "object" && error instanceof AxiosError) {
  //   console.log("axios");
  //   return handleApiError(error, options);
  // }

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
 * Handle authentication errors
 */
function handleAuthError(error: AuthError, options: ErrorHandlerOptions) {}

/**
 * Handle non-critical errors (always toast)
 */
function handleNonCriticalError(error: NonCriticalError) {}

/**
 * Handle critical errors (always modal)
 */
function handleCriticalError(error: CriticalError, options: ErrorHandlerOptions) {}

/**
 * Handle base errors
 */
function handleBaseError(error: BaseError, options: ErrorHandlerOptions) {}

/**
 * Handle generic JavaScript errors
 */
function handleGenericError(error: unknown, options: ErrorHandlerOptions) {}
