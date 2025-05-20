<script setup lang="ts">
import { reactive, computed } from 'vue';

import { authFormValidation } from '@/utilities/AuthFormValidation';
import { FormData, FormField } from '@/types/authFormConfig'
import { AuthFormType } from '@/constants';

const props = defineProps<{
  fields: Array<FormField>,
  buttonText: string,
  error: string,
  formType: AuthFormType
}>();

const emit = defineEmits(['submit']);

const formData: FormData = reactive({});
const fieldErrors = reactive<Record<string, string>>({});

for (const field of props.fields) {
  formData[field.name] = '';
}

const hasErrors = computed(() => {
  return Object.keys(fieldErrors).some(key => fieldErrors[key]);
});

function validateField(field: FormField, value: string) {
    delete fieldErrors[field.name];
    
    const { isValid, errorMsg, errorField } = authFormValidation(field, value, formData);
    
    if (!isValid && errorMsg && errorField) {
        fieldErrors[errorField] = errorMsg;
    }
    
    return isValid;
}


async function onSubmit(e: any) {
  e.preventDefault();

  let isValid = true;
  props.fields.forEach(field => {
    if (!validateField(field, formData[field.name])) {
      isValid = false;
    }
  });
  
  if (isValid && !hasErrors.value) {
    emit('submit', {...formData});
  }
}

</script>

<template>
  <div class="container">
    <div class="auth__warning" v-if="error">
      {{ error }}
    </div>
    <form @submit.prevent="onSubmit">
      <div class="form-group" v-for="field in fields" :key="field.name">
          <label :for="field.name" class="auth-form__label">{{ field.label }}<span class="warning" v-if="field.required">*</span></label>
          <input
            :type="field.type"
            :id="field.name"
            @blur="validateField(field, formData[field.name])"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors[field.name] }"
            v-model="formData[field.name]"
          >
          <div class="error-slot">
            <span v-if="fieldErrors[field.name]" class="warning">{{ fieldErrors[field.name] }}</span>
          </div>
      </div>
      <button type="submit" :disabled="hasErrors">{{ buttonText }}</button>
    </form>
  </div>
</template>

<style lang="sass" scoped>

.is-invalid
  border-color: red

.auth__warning
    color: red
    font-size: clamp(10px, 1vw, 20px)
    margin: 5px auto 10px
    text-align: center
    border: 1px solid red
    width: 75%
    padding: 5px

    @media (min-width: 768px)
      margin: 25px auto

.form-group
    margin-bottom: 10px

    // @media (min-width: 768px)
    //   margin-bottom: 15px

.auth-form__label
    font-weight: 700
    margin-bottom: 5px
    
    span
      vertical-align: top
      margin-left: 5px

input.ng-invalid.ng-touched
    border: 1px solid red

    &+.email-warning
        display: block

.form-control
    display: block
    width: 100%
    height: 2em
    padding: 6px 12px
    margin-top: 0

    @media (min-width: 768px)
        height: 3em
        margin-top: 10px

.error-slot 
  height: 1.2em
  line-height: 1.2

.warning
    color: red
    font-size: .7em
    margin-top: 5px


button
    padding: 3px 6px
    color: #fff
    background-color: #337ab7
    border-color: #2e6da4

    &:disabled
      opacity: 0.5
      cursor: not-allowed

    @media (min-width: 768px)
        padding: 6px 12px

</style>