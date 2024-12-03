import { ref } from 'vue';
import type { Ref } from 'vue';
import { useCloudinarySignature } from './useCloudinarySignature';

interface UploadResponse {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

interface UploadError {
  message: string;
  details?: any;
}

/**
 * Composable for handling image uploads to Cloudinary
 * Manages upload state, preview URLs, and provides error handling
 */
export function useImageUpload() {
  const { generateSignature, isLoading: isGeneratingSignature } = useCloudinarySignature();
  
  const isUploading = ref(false);
  const isDeleting = ref(false);
  const error: Ref<UploadError | null> = ref(null);
  const uploadedUrl: Ref<string | null> = ref(null);
  const previewUrl: Ref<string | null> = ref(null);

  /**
   * Creates a preview URL for an image file
   * @param file - The image file to preview
   */
  const createPreview = (file: File) => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = URL.createObjectURL(file);
  };

  /**
   * Extracts public_id from Cloudinary URL
   * @param url - The Cloudinary URL
   * @returns string - The public_id of the image
   */
  const getPublicIdFromUrl = (url: string): string => {
    const matches = url.match(/\/v\d+\/(.+)\.[^.]+$/);
    return matches ? matches[1] : '';
  };

  /**
   * Deletes an image from Cloudinary
   * @param imageUrl - The URL of the image to delete
   * @returns Promise<boolean> - True if deletion was successful, false otherwise
   */
  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    if (!imageUrl) return false;
    
    isDeleting.value = true;
    error.value = null;

    try {
      const publicId = getPublicIdFromUrl(imageUrl);
      console.log('imageUrl: ', imageUrl);
      console.log('publicId: ', publicId);
      if (!publicId) {
        throw new Error('Invalid image URL');
      }

      const signatureData = await generateSignature({
        operation: 'delete',
        publicId
      });

      if (!signatureData) {
        throw new Error('Failed to generate deletion signature');
      }

      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('timestamp', signatureData.timestamp.toString());
      formData.append('signature', signatureData.signature);
      formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
      console.log('formData: ', formData);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/destroy`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Deletion failed: ' + response.statusText);
      }

      const data = await response.json();
      return data.result === 'ok';
    } catch (e: any) {
      error.value = {
        message: e.message || 'Failed to delete image',
        details: e
      };
      console.error('Error deleting image:', error.value);
      return false;
    } finally {
      isDeleting.value = false;
    }
  };

  /**
   * Uploads an image to Cloudinary using a signed request
   * @param file - The image file to upload
   * @returns Promise<string | null> - The uploaded image URL or null if upload fails
   */
  const uploadImage = async (file: File): Promise<string | null> => {
    isUploading.value = true;
    error.value = null;
    uploadedUrl.value = null;

    try {
      // Generate signature for secure upload
      const signatureData = await generateSignature({
        operation: 'upload'
      });

      if (!signatureData) {
        throw new Error('Failed to generate upload signature');
      }

      // Create form data with signature and file
      const formData = new FormData();
      formData.append('file', file);
      
      // First add the parameters that were used for signature generation in the same order
      if (signatureData.folder) {
        formData.append('folder', signatureData.folder);
      }
      formData.append('timestamp', signatureData.timestamp.toString());
      if (signatureData.uploadPreset) {
        formData.append('upload_preset', signatureData.uploadPreset);
      }
      
      // Then add the signature and api_key which weren't part of signature generation
      formData.append('signature', signatureData.signature);
      formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed: ' + response.statusText);
      }

      const data: UploadResponse = await response.json();
      uploadedUrl.value = data.secure_url;
      return data.secure_url;
    } catch (e: any) {
      error.value = {
        message: e.message || 'Failed to upload image',
        details: e
      };
      console.error('Error uploading image:', error.value);
      return null;
    } finally {
      isUploading.value = false;
    }
  };

  /**
   * Cleanup function to revoke any existing preview URLs
   */
  const cleanup = () => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
      previewUrl.value = null;
    }
  };

  return {
    uploadImage,
    deleteImage,
    createPreview,
    cleanup,
    isUploading,
    isDeleting,
    isGeneratingSignature,
    error,
    uploadedUrl,
    previewUrl
  };
}
