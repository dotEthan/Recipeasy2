<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router/main'
import { useAppStore } from '@/stores/app'
import { useAuthService } from '@/composables/useAuthService'
import XToCloseComponent from '../shared/xToClose/XToCloseComponent.vue';
import AppModalComponent from '../shared/appModal/AppModalComponent.vue';

const appStore = useAppStore()

let authError = ref(false)
const {registerUser, signIn} = useAuthService()
let thisType = ref(appStore.registrationOrSigninModal)

async function onSubmit(e: any) {
  const { email, password } = e.target.elements

  authError.value = false

  if (thisType.value === 'register') {
    try {
      authError.value = false
      const { email, password } = e.target.elements
      registerUser(email.value, password.value)
    } catch (error) {
      authError.value = true
      // TODO handle registration error
      console.error(error)
    }
  } else if (thisType.value === 'signin') {
    try {
      signIn(email.value, password.value)
    } catch(error) {
      //TODO Handle Errors
      console.error(error)
    }
  }
  console.log('user signed in, initializing store')

  router.push('/')
  appStore.toggleRegistrationModal()
}

function onSwitchTypeHandler(type: string) {
  appStore.toggleRegistrationModal(type)
}

function onClose() {
  appStore.toggleRegistrationModal()
}
</script>
<template>
  <AppModalComponent :close="onClose">
    <div class="row">
      <div class="col-xs-10 col-xs-offset-1">
        <div class="text-center auth__title">
          <h1>{{ thisType }}</h1>
        </div>
        <div class="auth__warning" v-if="authError">{{ authError }}</div>
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <label class="signin-label" for="email">Email:</label>
            <input type="email" id="email" name="email" class="form-control" />
            <div class="email-warning">Not a valid Email</div>
          </div>
          <div class="form-group">
            <label class="signin-label" for="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              class="form-control"
              ngModel
            />
          </div>
          <button class="btn btn-primary" type="submit" v-if="thisType === 'signin'">
            Sign In
          </button>
          <button class="btn btn-primary" type="submit" v-if="thisType === 'register'">
            Register
          </button>
        </form>
        <hr />
        <div class="auth-mistake" v-if="thisType === 'register'">
          Already Registered?
          <a style="cursor: pointer" @click="onSwitchTypeHandler('signin')">Sign in here!</a>
        </div>
        <div class="auth-mistake" v-if="thisType === 'signin'">
          No account?
          <a style="cursor: pointer" @click="onSwitchTypeHandler('register')"
            >Register here!</a
          >
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

.auth__warning
    color: red
    font-size: clamp(10px, 1vw, 20px)
    margin: 5px auto 10px
    text-align: center
    border: 1px solid red
    width: 75%
    padding: 5px

    @media (min-width: 768px)
      margin: 25px auto

.form-group
    margin-bottom: 10px

    // @media (min-width: 768px)
    //   margin-bottom: 15px

.signin-label
    font-weight: 700
    margin-bottom: 5px

input.ng-invalid.ng-touched
    border: 1px solid red

    &+.email-warning
        display: block

.form-control
    display: block
    width: 100%
    height: 2em
    padding: 6px 12px
    margin-top: 0

    @media (min-width: 768px)
        height: 3em
        margin-top: 10px

.email-warning
    display: none
    margin-top: 5px
    color: red
    font-size: .8em


.btn
    padding: 3px 6px
    color: #fff
    background-color: #337ab7
    border-color: #2e6da4

    @media (min-width: 768px)
        padding: 6px 12px

.auth-mistake
    font-size: .8em

    @media (min-width: 768px)
        font-size: 1em

hr
    margin-top: 20px
    border-color: #fff
</style>
