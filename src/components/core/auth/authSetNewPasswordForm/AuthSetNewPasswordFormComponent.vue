<script setup lang="ts">
/**
 * Component for allowing user to set their new password after link with token clicked
 * @example
 * <AuthSetNewPasswordFormComponet @switch-type="onSwitchTypeHandler" />
 */
import { useRoute } from "vue-router";

import { useAuthService } from "@/composables/useAuthService";
import { AuthFormType } from "@/constants";
import router from "@/router/main";
import { useAppStore } from "@/stores/appStore";
import type { FormData, FormField } from "@/types/authFormConfig";

import AuthFormComponent from "../authForm/AuthFormComponent.vue";

const authService = useAuthService();
const appStore = useAppStore();
const route = useRoute();

const token = route.query.token?.toString() || "";

const signinFields = [
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    required: true
  }
] as FormField[];

async function handleSubmit(formData: FormData) {
  try {
    if (formData.password !== formData.confirmPassword) throw new Error("Passwords do not match.");
    await authService.setNewPassword(formData.password, token);
    router.push("/");
    appStore.setAuthModalType("");
  } catch (error) {
    console.log("signin error: ", error);
    // authError.value = error.message || 'Failed to sign in';
    console.error(error);
  }
}
</script>

<template>
  <div class="row">
    <div class="col-xs-10 col-xs-offset-1">
      <div class="text-center auth__title">
        <h1>Enter New Password</h1>
      </div>
      <AuthFormComponent
        :fields="signinFields"
        button-text="Set Password"
        :formType="AuthFormType.SET_PASSWORD"
        @submit="handleSubmit"
        error=""
      />
      <hr />
    </div>
  </div>
</template>

<style lang="sass" scoped>

.auth-mistake
    font-size: .8em
    display: flex
    flex-direction: row
    justify-content: flex-end

    @media (min-width: 768px)
        font-size: 1em

hr
    margin-top: 20px
    border-color: #fff

.auth-footer
  display: inline-block

  &__text
    cursor: pointer
    text-decoration: underline
</style>
