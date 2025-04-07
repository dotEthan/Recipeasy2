
<script setup lang="ts">
import AuthFormComponent from '../authForm/AuthFormComponent.vue';
import {useAuthService} from '@/composables/useAuthService';
import { FormField, FormData } from '@/types/authFormConfig';
import { ref } from 'vue';

const authService = useAuthService();

let resetSuccessful = ref(false);


const signinFields = [
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        warning: ''
    }
] as FormField[];

async function handleSubmit(formData: FormData) {
  try {
    await authService.passwordReset(formData.email);
    resetSuccessful.value = true;
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
              <h1>Reset Password</h1>
              <div v-if="resetSuccessful">
                <hr />
                <h3>Check email for reset password link.</h3>
                <hr />
              </div>
            </div>
            <AuthFormComponent :fields="signinFields" button-text="Reset Password" @submit="handleSubmit" error="" />
            <hr />
            <div class="auth-mistake">
              <div class="auth-footer">
                <a class="auth-footer__text" @click="$emit('switch-type', 'signin')">Back to Signin</a>
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