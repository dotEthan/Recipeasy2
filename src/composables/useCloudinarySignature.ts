import { SignatureRequest } from '@/types/apiRequest';
import { CloudSignatureResponse } from '@/types/ApiResponse';
import { SignatureError } from '@/types/errors';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useDataService } from './useDataService';



/**
 * Error states for signature generation
 */

/**
 * Composable for handling Cloudinary signature generation
 * Manages the state of signature generation and provides error handling
 */
export function useCloudinarySignature() {
  const dataService = useDataService();
  const isLoading = ref(false);
  const error: Ref<SignatureError | null> = ref(null);
  const signature: Ref<CloudSignatureResponse | null> = ref(null);


  /**
   * Generates a new Cloudinary signature using Firebase Functions
   * Requires the user to be authenticated
   * @param {SignatureRequest} request - The signature request details
   * @returns Promise<SignatureResponse | null>
   */
  const generateSignature = async (request: SignatureRequest): Promise<CloudSignatureResponse | null> => {
    console.log('Starting signature generation process...', request);
    isLoading.value = true;
    error.value = null;
    signature.value = null;

    try {
      console.log('User authenticated, calling cloud function...');
      const signature = await dataService.getCloudinarySignature();
      if (!signature) {
        console.error('No data received from cloud function');
        throw new Error('No signature data received from server');
      }

      console.log('Successfully received signature from cloud function');
      signature.value = signature;
      return signature;
    } catch (e: any) {
      console.error('Failed to generate signature:', e);
      
      let errorDetails = e.details;
      if (e instanceof Error) {
        errorDetails = e.stack || e.message;
      }

      const errorMessage = {
        code: e.code || 'unknown',
        message: e.message || 'Failed to generate signature',
        details: errorDetails
      };

      error.value = errorMessage;
      console.error('Detailed error information:', errorMessage);
      return null;
    } finally {
      isLoading.value = false;
      console.log('Signature generation process completed');
    }
  };

  return {
    generateSignature,
    isLoading,
    error,
    signature
  };
}
