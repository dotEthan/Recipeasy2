import { FormField } from "@/types/authFormConfig";
import { ValidationResult } from "@/types/form";

export const authFormValidation = (field: FormField, value: string, formData?: Record<string, string>): ValidationResult => {
    if (field.required && !value) {
        return {
            isValid: false,
            errorMsg: `${field.label} is required`,
            errorField: field.name
        };
    }
    
    switch (field.name) {
        case 'displayName':
            if (value.length > 15) {
                return {
                    isValid: false,
                    errorMsg: 'Name cannot be over 15 characters',
                    errorField: field.name
                };
            }
            break;
            
        case 'email':
            if (!validateEmail(value)) {
                return {
                    isValid: false,
                    errorMsg: 'Please enter a valid email address',
                    errorField: field.name
                };
            }
            break;
            
        case 'password':
            if (value.length < 8) {
                return {
                    isValid: false,
                    errorMsg: 'Password must be at least 8 characters',
                    errorField: field.name
                };
            }
            
            if (formData?.confirmPassword && formData.confirmPassword.length > 0 && 
                value !== formData.confirmPassword) {
                return {
                    isValid: false,
                    errorMsg: 'Passwords must match',
                    errorField: 'confirmPassword'
                };
            }
            break;
            
        case 'confirmPassword':
            if (formData?.password && value !== formData.password) {
                return {
                    isValid: false,
                    errorMsg: 'Passwords must match',
                    errorField: field.name
                };
            }
            break;
    }
    
    return { isValid: true };
}

function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}