import { AxiosError } from "axios";

import { BaseError, CriticalError, NonCriticalError } from "@/errors";
import { useErrorStore } from "@/stores/errorStore";
import { ErrorHandlerOptions, ToastError } from "@/types/errors";

/**
 * Central error handler - delegates to appropriate handling method
 */
export function handleError(error: Error, options: ErrorHandlerOptions = {}) {
  const errorStore = useErrorStore();
  console.log("options: ", options);
  console.log("handling error: ", error.name);
  console.log("Error type:", error.constructor.name);

  if (error instanceof AxiosError) {
    handleApiError(error, options);
  } else {
    console.log("what is this?: ", error);
  }
}

/**
 * Handle API errors
 */
function handleApiError(error: AxiosError, options: ErrorHandlerOptions) {
  const errorStore = useErrorStore();
  switch (error.status) {
    case 404: {
      console.log("404s: ", error);
      const toastError: ToastError = {
        toastId: Date.now(),
        message: error.message,
        errorCode: `error.status`,
        timestamp: new Date(),
        actionId: options.context?.actionId || ""
      };
      errorStore.addToastError(toastError, true, options);
      break;
    }
  }
}
