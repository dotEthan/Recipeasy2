import * as admin from "firebase-admin"
import { onCall } from "firebase-functions/v2/https"
import { v2 as cloudinary } from "cloudinary"
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
    const cloudConfig = {
      cloud_name: cloudinaryNameSecret.value(),
      api_key: cloudinaryApiKeySecret.value(),
      api_secret: cloudinaryApiSecretSecret.value(),
      upload_preset: cloudinaryUploadPresetSecret.value()
    }

    // Log config presence (without values)
    console.log("Cloudinary config keys present:", {
      has_cloud_name: !!cloudConfig.cloud_name,
      has_api_key: !!cloudConfig.api_key,
      has_api_secret: !!cloudConfig.api_secret,
      has_upload_preset: !!cloudConfig.upload_preset
    })

    // Validate config
    if (
      !cloudConfig.cloud_name ||
      !cloudConfig.api_key ||
      !cloudConfig.api_secret ||
      !cloudConfig.upload_preset
    ) {
      throw new Error("Missing required Cloudinary configuration")
    }

    cloudinary.config({
      cloud_name: cloudConfig.cloud_name,
      api_key: cloudConfig.api_key,
      api_secret: cloudConfig.api_secret
    })
    console.log("Cloudinary configured successfully with cloud name:", cloudConfig.cloud_name)

    const timestamp = Math.floor(Date.now() / 1000)
    const folder = `Recipeasy/user_uploads/users/${userId}`

    const paramsToSign = {
      folder,
      timestamp,
      upload_preset: cloudConfig.upload_preset
    }

    console.log("Generating signature with params:", paramsToSign)

    const signature = cloudinary.utils.api_sign_request(paramsToSign, cloudConfig.api_secret)

    console.log("Signature generated successfully")

    return {
      signature,
      timestamp,
      uploadPreset: cloudConfig.upload_preset,
      folder,
      expirationTime: timestamp + 600 // 10 min expiration
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
      "http://localhost:5173", // Vite default dev server
      "http://localhost:3000", // Alternative common dev port
      "http://127.0.0.1:5173", // Local IPv4
      "http://127.0.0.1:3000" // Local IPv4 alternative
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
