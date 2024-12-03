import * as admin from "firebase-admin"
import { onCall } from "firebase-functions/v2/https"
import { v2 } from "cloudinary"
import { defineSecret } from "firebase-functions/params"

interface SignatureResponse {
  signature: string
  timestamp: number
  uploadPreset: string
  folder: string
  expirationTime: number
}

// Initialize Firebase Admin
admin.initializeApp()

// Define secrets with different names to avoid conflicts
const cloudinaryNameSecret = defineSecret("CLOUDINARY_NAME_SECRET")
const cloudinaryApiKeySecret = defineSecret("CLOUDINARY_API_KEY_SECRET")
const cloudinaryApiSecretSecret = defineSecret("CLOUDINARY_API_SECRET_SECRET")
const cloudinaryUploadPresetSecret = defineSecret("CLOUDINARY_UPLOAD_PRESET_SECRET")

/**
 * Creates a Cloudinary signature for secure file uploads.
 * @param {string} userId - The authenticated user's ID
 * @return {Promise<SignatureResponse>} The signature response object
 */
async function generateSignature(userId: string): Promise<SignatureResponse> {
  console.log("Generating signature for user:", userId)

  try {
    // Validate user exists
    await admin.auth().getUser(userId)
    console.log("User validated successfully")

    // Get config from secrets
    const cloudName = cloudinaryNameSecret.value()
    const apiKey = cloudinaryApiKeySecret.value()
    const apiSecret = cloudinaryApiSecretSecret.value()
    const uploadPreset = cloudinaryUploadPresetSecret.value()

    // Log config presence (without values)
    console.log("Cloudinary config keys present:", {
      has_cloud_name: !!cloudName,
      has_api_key: !!apiKey,
      has_api_secret: !!apiSecret,
      has_upload_preset: !!uploadPreset
    })

    // Validate config
    if (!cloudName || !apiKey || !apiSecret || !uploadPreset) {
      throw new Error("Missing required Cloudinary configuration")
    }

    // Configure Cloudinary with explicit values using v2
    console.log("Attempting to configure Cloudinary with cloud_name:", cloudName)

    try {
      // Use v2 configuration
      v2.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
      })

      // Verify configuration using v2
      const testConfig = v2.config()
      console.log("Cloudinary configured successfully. Verified cloud_name:", testConfig.cloud_name)
    } catch (configError) {
      console.error("Error configuring Cloudinary:", configError)
      throw new Error(`Failed to configure Cloudinary: ${configError}`)
    }

    const timestamp = Math.floor(Date.now() / 1000)
    const folder = `Recipeasy/user_uploads/users/${userId}`

    const paramsToSign = {
      timestamp,
      folder,
      upload_preset: uploadPreset
    }

    console.log("Generating signature with params:", {
      ...paramsToSign,
      upload_preset: uploadPreset
    })

    try {
      // Use v2 signature generation
      const signature = v2.utils.api_sign_request(paramsToSign, apiSecret)
      console.log("Signature generated successfully")

      return {
        signature,
        timestamp,
        uploadPreset,
        folder,
        expirationTime: timestamp + 600 // 10 min expiration
      }
    } catch (signError) {
      console.error("Error generating signature:", signError)
      throw new Error(`Failed to generate signature: ${signError}`)
    }
  } catch (error) {
    console.error("Error in generateSignature:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to generate signature")
  }
}

/**
 * Callable function that creates Cloudinary signatures
 */
export const createCloudinarySignature = onCall(
  {
    enforceAppCheck: false,
    timeoutSeconds: 30,
    memory: "256MiB",
    region: "us-central1",
    cors: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
      "https://stupefied-morse-5e1233.netlify.app"
    ],
    secrets: [
      cloudinaryNameSecret,
      cloudinaryApiKeySecret,
      cloudinaryApiSecretSecret,
      cloudinaryUploadPresetSecret
    ]
  },
  async (request) => {
    console.log("Function invoked with auth:", request.auth)

    if (!request.auth) {
      console.error("No auth context provided")
      throw new Error("Authentication required")
    }

    try {
      return await generateSignature(request.auth.uid)
    } catch (error) {
      console.error("Top-level function error:", error)
      throw error
    }
  }
)
