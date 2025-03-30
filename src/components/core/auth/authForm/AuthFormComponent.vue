<script setup lang="ts">
import router from '@/router/main'
import { useAuthService } from '@/composables/useAuthService';

const props = defineProps({
  formType: {
    type: String,
    required: true,
  },
  authError: {
    type: Boolean,
    required: true
  }
});

const authService = useAuthService();

async function onSubmit(e: any) {
  const { displayName, email, password } = e.target.elements

  props.authError = false

  if (props.formType === 'register') {
    try {
      authError.value = false
      const { email, password } = e.target.elements
      authService.registerUser(displayName.value, email.value, password.value)
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
    <button class="btn btn-primary" type="submit" v-if="thisType === 'signin'">
        Sign In
    </button>
    <button class="btn btn-primary" type="submit" v-if="thisType === 'register'">
        Register
    </button>
</form>
</template>

<style lang="sass" scoped>
</style>