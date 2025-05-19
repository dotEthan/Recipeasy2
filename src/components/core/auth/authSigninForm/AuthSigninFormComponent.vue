<script setup lang="ts">
import router from '@/router/main';
import AuthFormComponent from '../authForm/AuthFormComponent.vue';
import {useAuthService} from '@/composables/useAuthService';
import { useAppStore } from '@/stores/appStore';

import { FormField, FormData } from '@/types/authFormConfig';
import { AuthFormType } from '@/constants';

const authService = useAuthService();
const appStore = useAppStore();

const signinFields = [
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true
    }
] as FormField[]

async function handleSubmit(formData: FormData) {
  try {
    const userVerified = await authService.signIn(formData.email, formData.password);
    console.log('user Signed in, is verified: ', userVerified)
    if (!userVerified) {
      appStore.setAuthModalType('verify-email');
    } else {
      router.push('/');
      appStore.setAuthModalType();
    }
  } catch(error) {
    console.log('signin error: ', error)
    // authError.value = error.message || 'Failed to sign in';
    console.error(error);
  }
}

</script>
<template>

<div class="row">
      <div class="col-xs-10 col-xs-offset-1">
        <div class="text-center auth__title">
          <h1>Sign In</h1>
        </div>
        <AuthFormComponent :fields="signinFields" button-text="Sign In" :formType="AuthFormType.SIGNIN" @submit="handleSubmit" error="" />
        <hr />
        <div class="auth-mistake">
          <div class="auth-footer">
            No account?
            <a class="auth-footer__text" @click="$emit('switch-type', 'register')">Register here!</a>
          </div>
          <div class="auth-footer">
            <a class="auth-footer__text" @click="$emit('switch-type', 'reset')">Forgot your password?</a>
          </div>
        </div>
      </div>
    </div>
</template>

<style lang="sass" scoped>


.auth-mistake
    font-size: .8em
    display: flex
    flex-direction: row
    justify-content: space-between

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