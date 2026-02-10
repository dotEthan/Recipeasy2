<script setup lang="ts">
/**
 * Component for allowing user to enter emailed code for email verification
 * @example
 * <AuthEmailVerificationFormComponet @switch-type="onSwitchTypeHandler" />
 */
import { ref } from "vue";

import { useAuthService } from "@/composables/useAuthService";
import { useAppStore } from "@/stores/appStore";

import ButtonComponent from "../../shared/button/ButtonComponent.vue";

const authService = useAuthService();
const appStore = useAppStore();

const codes = ref(Array(6).fill(""));
const inputs = ref<HTMLInputElement[]>([]);

const handleSubmit = async () => {
  try {
    await authService.verifyUser(codes.value.join(""));

    appStore.setAuthModalType("login");
  } catch (error) {
    console.log("email verification error: ", error);
  }
};
// TODO Style and make work properly

const handleInput = (e: Event, index: number) => {
  const targetEle = e.target as HTMLInputElement;
  if (targetEle.value.length === 1 && index < 5) {
    inputs.value[index + 1].focus();
  }
};

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const pasteData = e.clipboardData?.getData("text").trim() || "";
  if (/^\d{6}$/.test(pasteData)) {
    codes.value = pasteData.split("");
  }
};

const resendEmailVerification = () => {
  console.log("resend");
};
</script>

<template>
  <div class="verification-container">
    <h1>Verification Code</h1>
    <h2 class="mt-2">Please enter email verification Code</h2>

    <form class="mt-5" method="dialog" @submit="handleSubmit">
      <input
        v-for="n in 6"
        :key="n"
        type="number"
        v-model="codes[n - 1]"
        @input="(e) => handleInput(e, n - 1)"
        maxlength="1"
        ref="inputs"
        @paste="handlePaste"
        class="code-input border-1 w-2 h-3 bg-[var(--color-surface)]" />
      <ButtonComponent
        type="submit"
        label="Verify"
        size="md"
        :hasIcon="false"
        @click="resendEmailVerification" />
    </form>
    <div class="flex flex-row items-center">
      <span class="text-sm">Email did not come? </span>
      <ButtonComponent label="Resend" size="sm" :hasIcon="false" @click="resendEmailVerification" />
    </div>
  </div>
</template>

<style lang="sass" scoped>
.verification-container
    text-align: center

    .code-input
        width: 2em
        height: 2em
        font-size: 1.5em
        text-align: center
        margin: 0 0.2em
        -moz-appearance: textfield

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button
            -webkit-appearance: none
            margin: 0

        &::focus-visible
            outline: 2px solid #4a90e2

    button
        display: block
        margin: 1em auto 0
        padding: 0.5em 1em
</style>
