import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { ref } from 'vue';
import type { Ref } from 'vue';

/**
 * Response from the Cloudinary signature Firebase function
 */
interface SignatureResponse {
  signature: string;
  timestamp: number;
  uploadPreset?: string;
  folder?: string;
  expirationTime: number;
}

interface SignatureRequest {
  operation: 'upload' | 'delete';
  publicId?: string;
}

/**
 * Error states for signature generation
 */
interface SignatureError {
  code: string;
  message: string;
  details?: string;
}

/**
 * Composable for handling Cloudinary signature generation
 * Manages the state of signature generation and provides error handling
 */
export function useCloudinarySignature() {
  const isLoading = ref(false);
  const error: Ref<SignatureError | null> = ref(null);
  const signature: Ref<SignatureResponse | null> = ref(null);

  // Initialize Firebase Functions
  const functions = getFunctions(undefined, 'us-central1');

  const createCloudinarySignature = httpsCallable<SignatureRequest, SignatureResponse>(
    functions,
    'createCloudinarySignature'
  );

  /**
   * Generates a new Cloudinary signature using Firebase Functions
   * Requires the user to be authenticated
   * @param {SignatureRequest} request - The signature request details
   * @returns Promise<SignatureResponse | null>
   */
  const generateSignature = async (request: SignatureRequest): Promise<SignatureResponse | null> => {
    console.log('Starting signature generation process...', request);
    isLoading.value = true;
    error.value = null;
    signature.value = null;

    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        console.error('No authenticated user found');
        throw new Error('User must be authenticated to generate signature');
      }

      console.log('User authenticated, calling cloud function...');
      const result: HttpsCallableResult<SignatureResponse> = await createCloudinarySignature(request);
      
      if (!result.data) {
        console.error('No data received from cloud function');
        throw new Error('No signature data received from server');
      }

      console.log('Successfully received signature from cloud function');
      signature.value = result.data;
      return result.data;
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
