// For sesssion storage persistence
export const SESSION_STORAGE_EXPIRY = 300

export const CACHED_DATA_TTL = 900000

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5mb

export const TOAST_DURATION = 3000

export enum AuthFormType {
  SIGNIN = 'signin',
  REGISTER = 'register',
  RESET = 'reset',
  SET_PASSWORD = 'set-password',
  VERIFY_EMAIL = 'verify-email', // Remove?
}