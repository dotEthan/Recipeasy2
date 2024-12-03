import * as admin from "firebase-admin"
import { onCall } from "firebase-functions/v2/https"
import { v2 as cloudinary } from "cloudinary"
import { defineSecret } from "firebase-functions/params"
import * as crypto from "crypto"

interface SignatureResponse {
  signature: string
  timestamp: number
  uploadPreset?: string
  folder?: string
  expirationTime: number
}

interface SignatureRequest {
  operation: "upload" | "delete"
  publicId?: string
}

// Initialize Firebase Admin
admin.initializeApp()

// Define secrets with different names to avoid conflicts
const cloudinaryNameSecret = defineSecret("CLOUDINARY_NAME_SECRET")
const cloudinaryApiKeySecret = defineSecret("CLOUDINARY_API_KEY_SECRET")
const cloudinaryApiSecretSecret = defineSecret("CLOUDINARY_API_SECRET_SECRET")
const cloudinaryUploadPresetSecret = defineSecret("CLOUDINARY_UPLOAD_PRESET_SECRET")

/**
 * Creates a Cloudinary signature for secure file operations.
 * @param {string} userId - The authenticated user's ID
 * @param {SignatureRequest} request - The signature request details
 * @return {Promise<SignatureResponse>} The signature response object
 */
async function generateSignature(
  userId: string,
  request: SignatureRequest
): Promise<SignatureResponse> {
  console.log("Generating signature for user:", userId, "operation:", request.operation)

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

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    })

    const timestamp = Math.floor(Date.now() / 1000)
    let signature: string

    if (request.operation === "upload") {
      const folder = `Recipeasy/user_uploads/users/${userId}`
      const stringToSign = `folder=${folder}&timestamp=${timestamp}&upload_preset=${uploadPreset}`
      signature = crypto
        .createHash("sha1")
        .update(stringToSign + apiSecret)
        .digest("hex")

      return {
        signature,
        timestamp,
        uploadPreset,
        folder,
        expirationTime: timestamp + 600
      }
    } else if (request.operation === "delete") {
      if (!request.publicId) {
        throw new Error("Public ID is required for delete operation")
      }

      // For delete operations, only public_id and timestamp are used in the signature
      const stringToSign = `public_id=${request.publicId}&timestamp=${timestamp}`
      signature = crypto
        .createHash("sha1")
        .update(stringToSign + apiSecret)
        .digest("hex")

      return {
        signature,
        timestamp,
        expirationTime: timestamp + 600
      }
    } else {
      throw new Error("Invalid operation specified")
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

    if (!request.data || typeof request.data !== "object") {
      throw new Error("Invalid request data")
    }

    const { operation, publicId } = request.data as SignatureRequest

    if (!operation || !["upload", "delete"].includes(operation)) {
      throw new Error("Invalid operation specified")
    }

    try {
      return await generateSignature(request.auth.uid, { operation, publicId })
    } catch (error) {
      console.error("Top-level function error:", error)
      throw error
    }
  }
)
