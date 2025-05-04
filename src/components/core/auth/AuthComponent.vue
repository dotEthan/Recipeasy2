<script setup lang="ts">
import { computed, Ref, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import AppModalComponent from '../shared/appModal/AppModalComponent.vue';
import { FormType } from '@/types/authFormConfig';
import AuthSigninFormComponent from './authSigninForm/AuthSigninFormComponent.vue';
import AuthRegisterFormComponent from './authRegisterForm/AuthRegisterFormComponent.vue';
import AuthPasswordResetFormComponent from './authPasswordResetForm/authPasswordResetFormComponent.vue';
import AuthEmailVerificationFormComponent from './authEmailVerificationForm/AuthEmailVerificationFormComponent.vue';
import AuthSetNewPasswordFormComponent from './authSetNewPasswordForm/AuthSetNewPasswordFormComponent.vue';

// TODO Should be in Splash Component, but rework of splash component coming. 
const appStore = useAppStore();

let thisType = ref(appStore.authModalType) as Ref<FormType>;

const currentAuthComponent = computed(() => {
  switch (thisType.value) {
    case 'signin': return AuthSigninFormComponent;
    case 'register': return AuthRegisterFormComponent;
    case 'reset': return AuthPasswordResetFormComponent;
    case 'set-password': return AuthSetNewPasswordFormComponent;
    case 'verify-email': return AuthEmailVerificationFormComponent;
    default: return AuthSigninFormComponent
  }
})

function onSwitchTypeHandler(type: unknown) {
  const formType = type as FormType;
  console.log('switching modal type: ', formType);
  appStore.setAuthModalType(formType);
}

</script>
<template>
  <AppModalComponent :xToClose="true" :backdrop="true">
    <component :is="currentAuthComponent" @switch-type="onSwitchTypeHandler"  />
  </AppModalComponent>
</template>
<style lang="sass" scoped>
@use '@/assets/variables' as *
</style>
