import { RecipeFormData } from '@/types/form'
import { Recipe } from '@/types/Recipes'
import { ref, computed } from 'vue'

/**
 * Validation service to monitor the webform
 * @todo Still needed? Link into global handler store or replaced by?
//  * @returns - errors, validateField, validateForm
 * @example
 * validateForm(form);  
 */

type ValidationRules = typeof validationRules;

const validationRules = {
    name: [
      { required: true, message: 'Recipe name is required' },
      { minLength: 3, message: 'Recipe name must be at least 3 characters' }
    ],
    description: [
      { maxLength: 500, message: 'Description cannot exceed 500 characters' }
    ]
  }

export function useformValidation(formData: RecipeFormData) {
  const errors = ref({})
  
  const validateField = (field: keyof ValidationRules) => {
    const rules = validationRules[field] || []
    const value = formData[field]
    
    // for (const rule of rules) {
    //     if (rule.required && !formData[field]) {
    //       errors.value[field] = rule.message
    //       return false
    //     }
    // }
    
    // errors.value[field] = error
    // return !error
  }
  
  const validateForm = () => {
    // let isValid = true
    Object.keys(validationRules).forEach(field => {
      // if (!validateField(field, validationRules[field])) {
      //   isValid = false
      // }
    })
    // return isValid
    return true
  }
  
  return {
    errors,
    validateField,
    validateForm
  }
}