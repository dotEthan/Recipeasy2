
<script setup lang="ts">
import AuthFormComponent from '../authForm/AuthFormComponent.vue';
import {useAuthService} from '@/composables/useAuthService';
import { FormField, FormData } from '@/types/authFormConfig';

const authService = useAuthService();

const emit = defineEmits(['switch-type']);

const signinFields = [
    {
        name: 'displayName',
        label: 'Display Name',
        type: 'test',
        warning: ''
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        warning: ''
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        warning: ''
    },
    {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        warning: ''
    }
] as FormField[]

async function handleSubmit(formData: FormData) {
  await authService.registerUser(formData.displayName, formData.email, formData.password);
  console.log('registration Finished')
  emit('switch-type', 'verify-email');
  console.log('emitted')
}

</script>

<template>

    <div class="row">
          <div class="col-xs-10 col-xs-offset-1">
            <div class="text-center auth__title">
              <h1>Register</h1>
            </div>
            <AuthFormComponent :fields="signinFields" button-text="Register" @submit="handleSubmit" error="" />
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

.auth__title
    margin: 5px 0 5px
    text-align: center
    font-family: sans-serif

    @media (min-width: 768px)
        margin: 25px 0 25px

    h1
        font-size: 1.5em
        text-transform: capitalize

        @media (min-width: 768px)
            font-size: 2em
            
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