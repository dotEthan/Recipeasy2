import { Recipe } from "./Recipes"
import { LocalUser } from "./UserState"

export type StandardApiResponse = {
    success: boolean;
    message?: string;
    data?: unknown;
    error?: string;
};
export type StandardRecipeApiResponse = {
    success: boolean;
    message?: string;
    recipe?: Recipe;
    error?: string;
}

export type StandardUserApiResponse = {
    success: boolean;
    message?: string;
    user: LocalUser;
    error?: string;
}

export type GetUserDataResponse = {
    userData: LocalUser;
    userRecipes: Recipe[];
}

export interface ImageUploadResponse {
  success: boolean;
  url: string;
  message?: string;
}

export interface ApiErrorResponse {
  message?: string;
  validationErrors?: Record<string, string>;
  // expand if needed
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  // expand if needed
}