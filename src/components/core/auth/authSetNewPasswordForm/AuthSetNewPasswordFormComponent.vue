
<script setup lang="ts">
import AuthFormComponent from '../authForm/AuthFormComponent.vue';
import {useAuthService} from '@/composables/useAuthService';
import { useAppStore } from '@/stores/app';
import router from '@/router/main';
import { FormField, FormData } from '@/types/authFormConfig';
import { useRoute } from 'vue-router';

const authService = useAuthService();
const appStore = useAppStore();
const route = useRoute();

const token = route.query.token?.toString() || '';


const signinFields = [
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
  try {
    if (formData.password !== formData.confirmPassword) throw new Error('Passwords do not match.')
    await authService.setNewPassword(formData.password, token);
    router.push('/');
    appStore.setAuthModalType();
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
        <h1>Enter New Password</h1>
      </div>
      <AuthFormComponent :fields="signinFields" button-text="Set Password" @submit="handleSubmit" error="" />
      <hr />
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