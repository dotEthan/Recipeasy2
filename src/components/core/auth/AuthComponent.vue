<script setup lang="ts">
/**
 * Component for containing all Auth Modal types
 * @todo refactor, should be AppOverlays
 * @example
 * <AuthComponent v-if="isAuthModalOpen" />
 */
import { Ref, computed, ref } from "vue";

import { AuthFormType } from "@/constants";
import { useAppStore } from "@/stores/appStore";
import type { FormType } from "@/types/authFormConfig";

import AppModalComponent from "../shared/appModal/AppModalComponent.vue";
import AuthEmailVerificationFormComponent from "./authEmailVerificationForm/AuthEmailVerificationFormComponent.vue";
import AuthPasswordResetFormComponent from "./authPasswordResetForm/authPasswordResetFormComponent.vue";
import AuthRegisterFormComponent from "./authRegisterForm/AuthRegisterFormComponent.vue";
import AuthSetNewPasswordFormComponent from "./authSetNewPasswordForm/AuthSetNewPasswordFormComponent.vue";
import AuthSigninFormComponent from "./authSigninForm/AuthSigninFormComponent.vue";

const appStore = useAppStore();

let thisType = ref(appStore.authModalType) as Ref<FormType>;

const currentAuthComponent = computed(() => {
  switch (thisType.value) {
    case AuthFormType.SIGNIN:
      return AuthSigninFormComponent;
    case AuthFormType.REGISTER:
      return AuthRegisterFormComponent;
    case AuthFormType.RESET:
      return AuthPasswordResetFormComponent;
    case AuthFormType.SET_PASSWORD:
      return AuthSetNewPasswordFormComponent;
    case AuthFormType.VERIFY_EMAIL:
      return AuthEmailVerificationFormComponent;
    default:
      return AuthSigninFormComponent;
  }
});

function onSwitchTypeHandler(type: unknown) {
  const formType = type as FormType;
  appStore.setAuthModalType(formType);
}
</script>
<template>
  <AppModalComponent :xToClose="true" :backdrop="true">
    <component :is="currentAuthComponent" @switch-type="onSwitchTypeHandler" />
  </AppModalComponent>
</template>
<style lang="sass" scoped>
@use '@/assets/variables' as *
</style>
