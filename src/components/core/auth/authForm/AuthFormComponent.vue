<script setup lang="ts">
/**
 * Base Component all authForms rely on 
 * @todo refactor for errors coming from api
 * @example
 * <AuthFormComponent
      :fields="signinFields"
      button-text="Reset Password"
      :formType="AuthFormType.RESET"
      @submit="handleSubmit"
      error=""
    />
 */
import { computed, reactive } from "vue";

import { AuthFormType } from "@/constants";
import { FormData, FormField } from "@/types/authFormConfig";
import { authFormValidation } from "@/utilities/AuthFormValidation";

const props = defineProps<{
  fields: Array<FormField>;
  buttonText: string;
  error: string;
  formType: AuthFormType;
}>();

const emit = defineEmits(["submit"]);

const formData: FormData = reactive({});
const fieldErrors = reactive<Record<string, string>>({});

for (const field of props.fields) {
  formData[field.name] = "";
}

const hasErrors = computed(() => {
  return Object.keys(fieldErrors).some((key) => fieldErrors[key]);
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
  props.fields.forEach((field) => {
    if (!validateField(field, formData[field.name])) {
      isValid = false;
    }
  });

  if (isValid && !hasErrors.value) {
    emit("submit", { ...formData });
  }
}
</script>

<template>
  <div class="bg-primary p-6 rounded-lg mt-4 mb-4 w-full">
    <form @submit.prevent="onSubmit">
      <div class="mb-3" v-for="field in fields" :key="field.name">
        <div class="flex flex-row">
          <label :for="field.name" class="mb-0.5 font-bold text-surface"
            >{{ field.label }}<span class="text-red-500 ml-2" v-if="field.required">*</span></label
          >
          <div class="ml-2">
            <span v-if="fieldErrors[field.name]" class="text-red-500 text-sm">
              {{ fieldErrors[field.name] }}
            </span>
          </div>
        </div>
        <input
          :type="field.type"
          :id="field.name"
          @blur="validateField(field, formData[field.name])"
          class="form-control text-surface outline-1 outline-surface"
          :class="{ 'is-invalid': fieldErrors[field.name] }"
          v-model="formData[field.name]" />
      </div>
      <button type="submit" :disabled="hasErrors">{{ buttonText }}</button>
    </form>
  </div>
</template>

<style lang="sass" scoped>

.is-invalid
  border-color: red


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
    // height: 2em
    padding: 6px 12px
    margin-top: 0

    @media (min-width: 768px)
        // height: 3em
        margin-top: 10px

</style>
