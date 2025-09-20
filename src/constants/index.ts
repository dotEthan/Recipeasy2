// For sesssion storage persistence
export const SESSION_STORAGE_EXPIRY = 300;

export const CACHED_DATA_TTL = 900000;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5mb

export const DEFAULT_TOAST_DURATION = 3000;
export const DEFAULT_TOAST_MAX_RETRY = 3;

export enum AuthFormType {
  SIGNIN = "signin",
  REGISTER = "register",
  RESET = "reset",
  SET_PASSWORD = "set-password",
  VERIFY_EMAIL = "verify-email" // Remove?
}

export const COLLECTION_TAGS = {
  COLLECTION_1: ["popular"],
  COLLECTION_2: ["ethansFavourites"],
  COLLECTION_3: ["snack"],
  COLLECTION_4: ["mealTime"],
  COLLECTION_5: ["healthy"]
};

export const TAILWIND_BREAKPOINTS = {
  "2xl": 1536,
  xl: 1280,
  lg: 1024,
  md: 768,
  sm: 640,
  xs: 0
} as const;

export type ScreenSize = keyof typeof TAILWIND_BREAKPOINTS;
