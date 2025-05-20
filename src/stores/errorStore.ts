import { ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useAuthService } from "@/composables/useAuthService";
import { AuthError, BaseError, CriticalError, NonCriticalError, ValidationError } from "@/errors";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/ApiResponse";
import { FieldError, ToastError } from "@/types/errors";

/**
 * Store for all Global Error Handling
 * @todo Create
 * @todo Update Mock Store and Apply store types
 * @returns {Object} - 
 */

export const useErrorStore = defineStore('error', () => {
    const authService = useAuthService();

    // state
    const errors = ref<ToastError[]>([]);
    const validationErrors = ref({});
    const showErrorModal = ref<boolean>(false);
    const currentModalError = ref<BaseError | null>(null)
  
    // watchers (maybe not needed, persist errors?)

    // getters

    // actions

    const handleError = (error: unknown) => {
      if (error instanceof AxiosError) {
        return handleApiError(error);
      }
      
      // Handle custom error instances
      if (error instanceof ValidationError) {
        setValidationErrors(error.fieldErrors);
        return;
      }
      
      if (error instanceof AuthError) {
        addToastError(error);
        handleUnauthRedirect();
        return;
      }
      
      if (error instanceof NonCriticalError) {
        addToastError(error);
        return;
      }
      
      if (error instanceof CriticalError) {
        // showCriticalErrorModal(error);
        return;
      }
    }

    function handleApiError(error: AxiosError<ApiErrorResponse>) {
      const { status, data } = error.response || {};
      
      switch (status) {
        case 400:
          if (data?.validationErrors) {
            setValidationErrors(data.validationErrors);
          } else {
            addToastError(new NonCriticalError(data?.message || 'Invalid request'));
          }
          break;
          
        case 401:
        case 403:
          handleError(new AuthError(data?.message));
          break;
          
        case 404:
          addToastError(new NonCriticalError(data?.message || 'Resource not found'));
          break;
          
        case 500:
        case 502:
        case 503:
          handleError(new CriticalError(data?.message || 'Server error', {
            actions: [
              { label: 'Retry', action: 'retry' },
              { label: 'Report Issue', action: 'report' }
            ]
          }));
          break;
          
        default:
          addToastError(new NonCriticalError(data?.message || 'An error occurred'));
      }
    }

    function addToastError(error: NonCriticalError) {
      const errorData = {
        id: String(Date.now()),
        message: error.message,
        errorCode: error.errorCode || 'GENERAL',
        timestamp: new Date(),
      };
      
      errors.value.push(errorData);
      
      // Auto-dismiss non-critical errors
      if (error instanceof NonCriticalError) {
        setTimeout(() => dismissError(errorData.id), 5000);
      }
      
      return errorData.id;
    }

    function setValidationErrors(fieldErrors: FieldError) {
      validationErrors.value = fieldErrors;
    }
    
    function clearValidationErrors() {
      validationErrors.value = {};
    }
    
    function dismissError(id: string) {
      errors.value = errors.value.filter(error => error.id !== id);
    }
    
    function handleUnauthRedirect() {
      const router = useRouter();
      // Clear user session/token
      authService.logOut();
      router.push('/login');
    }
    
    // function showCriticalErrorModal(error) {
    //   currentModalError.value = {
    //     message: error.message,
    //     details: error.details,
    //     actions: error.actions
    //   };
    //   showErrorModal.value = true;
    // }

    function closeErrorModal() {
      showErrorModal.value = false;
      currentModalError.value = null;
    }
    
    // function handleModalAction(actionType) {
    //   // Implement different action handlers
    //   switch (actionType) {
    //     case 'retry':
    //       // Logic to retry last action
    //       break;
    //     case 'report':
    //       // Logic to report issue
    //       break;
    //   }
    //   closeErrorModal();
    // }
    return {
        errors,
        validationErrors,
        showErrorModal,
        currentModalError,
        handleError,
        handleApiError,
        setValidationErrors,
        clearValidationErrors,
        dismissError,
        handleUnauthRedirect,
        // showCriticalErrorModal,
        closeErrorModal,
        // handleModalAction,
    }
});