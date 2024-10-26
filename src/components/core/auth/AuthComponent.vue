<script setup lang="ts">
import { ref } from 'vue'
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getFirestore,
  type DocumentData
} from 'firebase/firestore'
import { createUserWithEmailAndPassword, type User } from 'firebase/auth'
import { auth, firebaseapp } from '../../../firebase'
import { useRecipeStore } from '@/stores/recipe'
import router from '@/router/main'
import { useUserStore } from '@/stores/user'
import type { Recipe } from '@/types/Recipes'
import { useAuthService } from '@/composables/useAuthService'
import type { LocalUser, UserState } from '@/types/UserState'

let authError = ref(false)
const recipeStore = useRecipeStore()
const userStore = useUserStore()
const authService = useAuthService()
let thisType = ref('signin')

// const docRef = doc(db, 'cities', 'SF')
// const docSnap = await getDoc(docRef)

const usersRef = collection(getFirestore(firebaseapp), 'users')

async function onSubmit(e: any) {
  const { email, password } = e.target.elements
  let usersFirebaseData, initUserData: LocalUser, userStoredData

  authError.value = false

  if (thisType.value === 'register') {
    authService
      .registerUser(email.value, password.value)
      .then((user) => {
        console.log('Logged in user:', user)
        usersFirebaseData = user
        userStoredData = {
          uid: user?.uid,
          email: user?.email,
          displayName: '',
          createdAt: new Date(),
          recipes: [],
          shoppingLists: []
        }

        return setDoc(doc(usersRef, user?.uid), userStoredData)
      })
      .then(() => {
        console.log('New User Data Saved to Firestore')
      })
      .catch((error) => console.error(error))
  } else if (thisType.value === 'signin') {
    authService
      .signIn(email.value, password.value)
      .then((user) => {
        console.log('Logged in user:', user)
        usersFirebaseData = user
        return getDoc(doc(usersRef, usersFirebaseData?.uid))
      })
      .then((data) => {
        userStoredData = data.data()
      })
      .catch((error) => console.error(error))
  }
  if (usersFirebaseData) initializeUserStoreData(usersFirebaseData, userStoredData)
  if (userStoredData) initializeRecipeStoreData(userStoredData)

  router.push('/')
}

// async function registerUser(email: string, password: string): Promise<User | undefined> {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password)
//     const user = userCredential.user

//     await setDoc(doc(usersRef, user.uid), {
//       uid: user.uid,
//       email: user.email,
//       displayName: '',
//       createdAt: new Date(),
//       recipes: []
//     })

//     console.log('User document created successfully:', user.uid)

//     return user
//   } catch (error: any) {
//     // TODO: handle errors
//     console.log('Error during registration:', error)
//     authError.value = error.message
//   }
// }

function initializeUserStoreData(user: User | undefined, userData: DocumentData | undefined) {
  const allUserTags: string[] = Array.from(
    new Set(userData?.recipes.flatMap((recipe: Recipe) => recipe.tags))
  )

  console.log('initial user: ', user)
  console.log('initial userdata: ', userData)
  const userState = {
    uid: user?.uid || '0000',
    localUser: { ...userData, uid: user?.uid },
    authorized: true,
    allTags: allUserTags
  }

  userStore.setInitialUserState(userState)
}

function initializeRecipeStoreData(userData: DocumentData) {
  recipeStore.setAllRecipes(userData.recipes)
  console.log('recipeStore filled. data: ', userData.recipes)
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
