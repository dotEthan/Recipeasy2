export type FormValue = string | number | boolean | null | undefined;

export interface RecipeFormData {
    [key: string]: FormValue;
}

export interface ValidationResult {
  isValid: boolean;
  errorMsg?: string;
  errorField?: string;
}