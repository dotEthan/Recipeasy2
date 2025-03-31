<script setup lang="ts">
import router from '@/router/main'
import { useAuthService } from '@/composables/useAuthService';
import { useAppStore } from '@/stores/app';
import { ref } from 'vue';

const props = defineProps({
  formType: {
    type: String,
    required: true,
  }
});

const authService = useAuthService();
const appStore = useAppStore();

let authError = ref(false);

async function onSubmit(e: any) {
  const { displayName, email, password } = e.target.elements;

  authError.value = false;

  if (props.formType === 'register') {
    try {
      authError.value = false;
      const { email, password } = e.target.elements;
      authService.registerUser(displayName.value, email.value, password.value);
    } catch (error) {
      authError.value = true
      // TODO handle registration error
      console.error(error)
    }
  } else if (props.formType === 'signin') {
    try {
      authService.signIn(email.value, password.value)
    } catch(error) {
      //TODO Handle Errors
      console.error(error)
    }
  }
  console.log('user signed in, initializing store')

  router.push('/')
  appStore.toggleRegistrationModal()
}

</script>

<template>

  <div class="auth__warning" v-if="authError">{{ authError }}</div>
  <form @submit.prevent="onSubmit">
      <div class="form-group" v-if="formType === 'register'">
          <label class="signin-label" for="displayName">Display Name:</label>
          <input type="string" id="displayName" name="displayName" class="form-control" />
          <div class="email-warning">Must be longer than 3 characters</div>
      </div>
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
      <button class="btn btn-primary" type="submit" v-if="formType === 'signin'">
          Sign In
      </button>
      <button class="btn btn-primary" type="submit" v-if="formType === 'register'">
          Register
      </button>
  </form>
</template>

<style lang="sass" scoped>

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

</style>