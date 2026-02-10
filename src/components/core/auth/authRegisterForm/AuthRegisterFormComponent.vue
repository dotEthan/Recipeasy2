<script setup lang="ts">
/**
 * Component for allowing user to register
 * @example
 * <AuthRegisterFormComponet @switch-type="onSwitchTypeHandler" />
 */
import { ref } from "vue";

import { useAuthService } from "@/composables/useAuthService";
import { AuthFormType } from "@/constants";
import type { FormData, FormField } from "@/types/authFormConfig";

import AuthFormComponent from "../authForm/AuthFormComponent.vue";

const authService = useAuthService();

const emit = defineEmits(["switch-type"]);

let errorMessage = ref("");

const signinFields = [
  {
    name: "displayName",
    label: "Display Name",
    type: "test",
    warning: "",
    required: true
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    warning: "",
    required: true
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    warning: "",
    required: true
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    warning: "",
    required: true
  }
] as FormField[];

async function handleSubmit(formData: FormData) {
  const result = await authService.registerUser(
    formData.displayName,
    formData.email,
    formData.password
  );

  if (!result.success) {
    errorMessage.value = result.message;
    return;
  }
  emit("switch-type", "verify-email");
}
</script>
<template>
  <div class="flex flex-col items-center">
    <div class="text-center auth__title">
      <h1 class="font-brand text-primary">Register</h1>
    </div>
    <div
      class="text-red-500 text-sm m-3 md:m-6 text-center border-1 border-solid border-red-500 w-[75%] p-2"
      v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <AuthFormComponent
      :fields="signinFields"
      button-text="Register"
      :formType="AuthFormType.REGISTER"
      @submit="handleSubmit"
      error="" />
    <hr class="mt-5 border-surface" />
    <div class="flex flex-row justify-between text-1 md:text-2 mt-2">
      <div class="inline-block text-primary">
        Already Registered?
        <a class="cursor-pointer underline" @click="$emit('switch-type', 'signin')"
          >Sign in here!</a
        >
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped></style>
