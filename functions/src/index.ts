import * as admin from "firebase-admin"
import { onRequest, onCall, HttpsError } from "firebase-functions/v2/https"
import express, { Request, Response, NextFunction } from "express"
import { v2 as cloudinary } from "cloudinary"
import "dotenv/config"

/**
 * Type definition for Cloudinary signature request parameters
 * @typedef {Object} SignatureParams
 * @property {number} timestamp - Unix timestamp for the request
 * @property {string} upload_preset - Cloudinary upload preset
 * @property {string} folder - Target folder for upload
 * @property {string} userEmail - Email of the requesting user
 */
interface SignatureParams {
  timestamp: number
  upload_preset: string
  folder: string
  userEmail: string | undefined
}

/**
 * Type definition for Cloudinary signature response
 * @typedef {Object} SignatureResponse
 * @property {string} signature - Generated Cloudinary signature
 * @property {number} timestamp - Unix timestamp of the request
 * @property {string} uploadPreset - Cloudinary upload preset used
 * @property {string} folder - Target folder for upload
 * @property {number} expirationTime - Timestamp when signature expires
 */
interface SignatureResponse {
  signature: string
  timestamp: number
  uploadPreset: string
  folder: string
  expirationTime: number
}

// Extend Express Request type to include user property
declare module "express" {
  export interface Request {
    user?: admin.auth.DecodedIdToken
  }
}

/**
 * Express application instance for handling HTTP requests.
 * Configured with JSON parsing middleware for request bodies.
 * @type {express.Application}
 */
const app = express()
app.use(express.json())

/**
 * Initialize Firebase Admin SDK with default credentials.
 * This setup enables server-side Firebase operations including auth verification.
 */
admin.initializeApp()

/**
 * Configure Cloudinary SDK with credentials from environment variables.
 * This setup enables cloud-based image management operations.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

/**
 * Cloudinary upload preset from environment.
 * @type {string}
 */
const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || ""

/**
 * Firebase Functions logger for consistent logging.
 */
const logger = console

/**
 * In-memory store for rate limiting.
 * Maps user IDs to their last request timestamp.
 * @type {Map<string, number>}
 */
const rateLimitStore = new Map<string, number>()

/**
 * Checks if a user has exceeded their rate limit for requests.
 * Each user is allowed up to 10 requests per 60 seconds.
 *
 * @param {string} userId - The unique identifier of the user.
 * @return {Promise<boolean>} A promise that resolves to `true`
 * if the user is within the rate limit, or `false` if they have exceeded it.
 * @throws {HttpsError} If rate limit is exceeded
 */
async function checkRateLimit(userId: string): Promise<boolean> {
  const now = Date.now()
  const lastRequest = rateLimitStore.get(userId) || 0
  const secondsSinceLastRequest = (now - lastRequest) / 1000
  const rateLimitStoreUserId = rateLimitStore.get(userId) || 0

  if (secondsSinceLastRequest < 60 && rateLimitStoreUserId >= 10) {
    throw new HttpsError("resource-exhausted", "Rate limit exceeded. Please try again later.", {
      timeToReset: 60 - secondsSinceLastRequest
    })
  }

  if (secondsSinceLastRequest >= 60) {
    rateLimitStore.delete(userId)
  }

  rateLimitStore.set(userId, (rateLimitStore.get(userId) || 0) + 1)
  return true
}

/**
 * Validates a user record from Firebase Authentication.
 * Checks if the user exists and is valid.
 *
 * @param {string} userId - The unique identifier of the user to validate.
 * @return {Promise<admin.auth.UserRecord>} The validated user record.
 * @throws {HttpsError} If user validation fails
 */
async function validateUserRecord(userId: string): Promise<admin.auth.UserRecord> {
  try {
    const userRecord = await admin.auth().getUser(userId)
    return userRecord
  } catch (error) {
    logger.error("User Validation Error", { userId, error })
    if (error instanceof HttpsError) {
      throw error
    }
    throw new HttpsError("internal", "Failed to validate user")
  }
}

/**
 * Creates a Cloudinary signature for secure file uploads.
 * Handles both HTTP and Callable function interfaces.
 *
 * @param {string} userId - The authenticated user's ID
 * @param {string | undefined} userEmail - The authenticated user's email
 * @return {Promise<SignatureResponse>} The signature response object
 * @throws {HttpsError} If validation fails or rate limit is exceeded
 */
async function createSignature(
  userId: string,
  userEmail: string | undefined
): Promise<SignatureResponse> {
  await Promise.all([checkRateLimit(userId), validateUserRecord(userId)])

  const timestamp = Math.floor(Date.now() / 1000)
  const folder = `users/${userId}`

  const params: SignatureParams = {
    timestamp,
    upload_preset: uploadPreset,
    folder,
    userEmail
  }

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET || ""
  )

  return {
    signature,
    timestamp,
    uploadPreset,
    folder,
    expirationTime: timestamp + 600 // 10 min expiration
  }
}

/**
 * Express middleware to verify Firebase Authentication token.
 * Extracts and validates the Bearer token from the Authorization header.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 * @return {Promise<void>} A promise that resolves when auth is verified.
 */
async function verifyAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Authentication required",
      details: "No token provided"
    })
    return
  }

  try {
    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    res.status(401).json({
      error: "Authentication failed",
      details: error instanceof Error ? error.message : "Invalid token"
    })
  }
}

/**
 * POST endpoint to create a Cloudinary signature.
 * Requires authentication and performs rate limiting.
 *
 * @route POST /createSignature
 * @authentication Required
 * @return {SignatureResponse} JSON object containing signature and related data
 * @throws {Error} If authentication fails or rate limit is exceeded
 */
app.post("/createSignature", verifyAuth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new Error("User not authenticated")
    }

    const result = await createSignature(req.user.uid, req.user.email)
    res.json(result)
  } catch (error) {
    if (error instanceof HttpsError) {
      res.status(error.httpErrorCode?.status || 500).json({
        error: error.code,
        message: error.message,
        details: error.details
      })
    } else {
      res.status(500).json({
        error: "internal",
        message: error instanceof Error ? error.message : "Unknown error"
      })
    }
  }
})

/**
 * Health check endpoint.
 * Used by Cloud Run to verify the service is running.
 *
 * @route GET /
 * @return {string} Simple "OK" response
 */
app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("OK")
})

/**
 * Callable function implementation of createCloudinarySignature.
 * Provides the same functionality as the HTTP endpoint but through Firebase Functions SDK.
 *
 * @function createCloudinarySignatureCallable
 * @type {CallableFunction}
 * @throws {HttpsError} If authentication fails or rate limit is exceeded
 */
export const createCloudinarySignatureCallable = onCall(
  {
    timeoutSeconds: 30,
    memory: "256MiB"
  },
  async (context) => {
    if (!context.auth) {
      throw new HttpsError("unauthenticated", "Authentication required")
    }

    return createSignature(context.auth.uid, context.auth.token.email)
  }
)

/**
 * HTTP function implementation of createCloudinarySignature.
 * Provides REST API access to the signature generation service.
 *
 * @function createCloudinarySignature
 * @type {HttpsFunction}
 */
export const createCloudinarySignature = onRequest(
  {
    memory: "256MiB",
    timeoutSeconds: 30,
    minInstances: 0,
    maxInstances: 100,
    concurrency: 80,
    invoker: "public"
  },
  app
)
