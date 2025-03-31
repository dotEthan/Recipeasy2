<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import AppModalComponent from '../shared/appModal/AppModalComponent.vue';
import AuthFormComponent from './authForm/AuthFormComponent.vue';

// TODO Should be in Splash Component, but rework of splash component coming. 
const appStore = useAppStore();

let thisType = ref(appStore.registrationOrSigninModal);

function onSwitchTypeHandler(type: string) {
  appStore.toggleRegistrationModal(type);
}

function onClose() {
  appStore.toggleRegistrationModal();
}
</script>
<template>
  <AppModalComponent :close="onClose">
    <div class="row">
      <div class="col-xs-10 col-xs-offset-1">
        <div class="text-center auth__title">
          <h1>{{ thisType }}</h1>
        </div>
        <AuthFormComponent :formType="thisType"/>
        <hr />
        <div class="auth-mistake" v-if="thisType === 'register'">
          Already Registered?
          <a style="cursor: pointer; text-decoration: underline;" @click="onSwitchTypeHandler('signin')">Sign in here!</a>
        </div>
        <div class="auth-mistake" v-if="thisType === 'signin'">
          <div>
            No account?
            <a style="cursor: pointer; text-decoration: underline;" @click="onSwitchTypeHandler('register')"
              >Register here!</a
            >
          </div>
          <div>
            
          </div>
        </div>
      </div>
    </div>
  </AppModalComponent>
</template>
<style lang="sass" scoped>
@use '@/assets/variables' as *

.auth__title
    margin-bottom: 25px
    text-align: center
    font-family: sans-serif
    text-transform: capitalize

    @media (min-width: 768px)
      margin-bottom: 50px

.auth__title
    margin: 5px 0 5px

    @media (min-width: 768px)
      margin: 25px 0 25px

    h1
        font-size: 1.5em

        @media (min-width: 768px)
            font-size: 2em

.auth-mistake
    font-size: .8em

    @media (min-width: 768px)
        font-size: 1em

hr
    margin-top: 20px
    border-color: #fff
</style>
