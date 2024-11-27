// @ts-check
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import process from 'node:process';

/**
 * Type definition for Cloudinary signature response
 * @typedef {Object} SignatureResponse
 * @property {string} signature - Generated Cloudinary signature
 * @property {number} timestamp - Unix timestamp of the request
 * @property {string} uploadPreset - Cloudinary upload preset used
 * @property {string} folder - Target folder for upload
 * @property {number} expirationTime - Timestamp when signature expires
 */

/**
 * Firebase project configuration
 * @type {Object}
 */
const firebaseConfig = {
    /*** Fill Yours Here ***/
};

/**
 * Initialize Firebase services and attempt to get a Cloudinary signature
 * Handles authentication and function calls with proper error handling
 * @return {Promise<SignatureResponse>}
 */
async function main() {
    try {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const functions = getFunctions(app);
        const auth = getAuth(app);

        // Authenticate user
        console.log('Authenticating...');
        await signInWithEmailAndPassword(auth, "test@test.com", "password");
        console.log('Authentication successful');

        // Get function reference with type information
        /** @type {(data: any) => Promise<{ data: SignatureResponse }>} */
        const createCloudinarySignature = httpsCallable(
            functions, 
            'createCloudinarySignatureCallable'
        );

        // Call function
        console.log('Requesting Cloudinary signature...');
        const result = await createCloudinarySignature({});
        const data = result.data;
        
        console.log('Signature created successfully:', {
            signature: data.signature,
            timestamp: data.timestamp,
            uploadPreset: data.uploadPreset,
            folder: data.folder,
            expiresAt: new Date(data.expirationTime * 1000).toLocaleString()
        });

        return data;
    } catch (error) {
        // Handle specific Firebase error types
        if (error.code) {
            switch (error.code) {
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                case 'auth/invalid-email':
                    console.error('Authentication error:', error.message);
                    break;
                case 'functions/unauthenticated':
                    console.error('Function call not authenticated');
                    break;
                case 'functions/resource-exhausted':
                    console.error('Rate limit exceeded:', error.details?.timeToReset || 'Please try again later');
                    break;
                case 'functions/failed-precondition':
                    console.error('Precondition failed:', error.message);
                    break;
                default:
                    console.error('Error:', error.message);
            }
        } else {
            console.error('Unexpected error:', error);
        }
        // Exit with error code 1 to indicate failure
        process.exit(1);
    }
}

// Execute the main function
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
