
<script setup lang="ts">
import AuthFormComponent from '../authForm/AuthFormComponent.vue';
import {useAuthService} from '@/composables/useAuthService';
import { FormField, FormData } from '@/types/authFormConfig';
import { AuthFormType } from '@/constants';

const authService = useAuthService();

const emit = defineEmits(['switch-type']);

const signinFields = [
    {
        name: 'displayName',
        label: 'Display Name',
        type: 'test',
        warning: '',
        required: true
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        warning: '',
        required: true
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        warning: '',
        required: true
    },
    {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        warning: '',
        required: true
    }
] as FormField[]

async function handleSubmit(formData: FormData) {
  await authService.registerUser(formData.displayName, formData.email, formData.password);
  emit('switch-type', 'verify-email');
}

</script>

<template>

    <div class="row">
          <div class="col-xs-10 col-xs-offset-1">
            <div class="text-center auth__title">
              <h1>Register</h1>
            </div>
            <AuthFormComponent :fields="signinFields" button-text="Register" :formType="AuthFormType.REGISTER" @submit="handleSubmit" error="" />
            <hr />
            <div class="auth-mistake">
              <div class="auth-footer">
                Already Registered?
                <a class="auth-footer__text" @click="$emit('switch-type', 'signin')">Sign in here!</a>
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