export type FormType = "signin" | "register" | "reset" | "verify-email" | "set-password";

export interface FormConfig {
  fields: FormField[];
  buttonText: string;
}

export interface FormField {
  name: string;
  type: "email" | "password" | "text";
  label: string;
  warning?: string;
  required: boolean;
}

export interface FormData {
  [key: string]: string;
}
