<script setup lang="ts">
import { ref } from 'vue'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebase'
import router from '@/router/main'

let authError = ref(false)
let thisType = ref('signin')

function onSubmit(e: any) {
  authError.value = false
  const { email, password } = e.target.elements
  if (thisType.value === 'register') {
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user
        console.log('user: ', user)
        router.push('/')
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        authError.value = error.message
        console.log('code: ', errorCode)
        console.log('MSG: ', errorMessage)
      })
  }

  if (thisType.value === 'signin') {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        console.log('signed in: ', user)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        authError.value = error.message
        console.log('signed in error: ', error)
      })
  }
}

function onSwitchTypeHandler(type: string) {
  thisType.value = type
}

function onClose() {
  console.log('close')
}
</script>
<template>
  <div class="auth__contain">
    <div class="auth__modal">
      <div class="auth__modal--white">
        <button type="button" class="close" aria-label="Close" @click="onClose()">
          <span aria-hidden="true">&times;</span>
        </button>
        <div>
          <div class="row">
            <div class="col-xs-10 col-xs-offset-1">
              <div class="text-center auth__title">
                <h1>{{ thisType }}</h1>
              </div>
              <div class="auth__warning" v-if="authError">{{ authError }}</div>
              <form @submit.prevent="onSubmit">
                <div class="form-group">
                  <label class="signin-label" for="email">Email:</label>
                  <input type="email" id="email" name="email" class="form-control" ngModel email />
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
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="sass">
@import '../../../assets/variables.sass'
.auth__contain
    position: absolute
    top: $navbar-height
    left: 0
    width: 100%
    height: calc(100vh - #{$navbar-height-minus})

.auth__modal
    position: absolute
    top: 0
    left: 0
    height: calc(100vh - #{$navbar-height-minus})
    width: 100%
    justify-content: center
    align-items: center
    display: flex
    justify-content: center
    align-items: center
    z-index: 1000

.auth__modal--white
    background: white
    width: 350px
    height: 400px
    position: relative
    border-radius: 15px
    box-shadow: 2px 3px 10px 1px rgba(0,0,0,.3)
    padding: 0 25px

    @media (min-width: 1024px)
      width: 350px
      height: 400px

.close
    position: absolute
    top: 15px
    right: 15px
    width: 25px
    height: 25px
    z-index: 99

.auth__title
    margin-bottom: 50px
    text-align: center
    font-family: sans-serif
    text-transform: capitalize

.auth__title
    margin: 25px 0 25px

    h1
        font-size: 1.5em

        @media (min-width: 768px)
            font-size: 2em

.auth__warning
    color: red
    font-size: 0.9em
    margin: 25px auto
    text-align: center
    border: 1px solid red
    width: 75%
    padding: 5px

.form-group
    margin-bottom: 15px

.signin-label
    font-size: 1em
    font-weight: 700
    margin-bottom: 15px

input.ng-invalid.ng-touched
    border: 1px solid red

    &+.email-warning
        display: block

.form-control
    display: block
    width: 100%
    height: 2em
    padding: 6px 12px
    margin-top: 10px

    @media (min-width: 768px)
        height: 3em

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
