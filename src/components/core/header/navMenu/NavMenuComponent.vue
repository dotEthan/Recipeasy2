<script setup lang="ts">
import { computed } from 'vue'
import { getAuth, signOut } from 'firebase/auth'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import router from '@/router/main'
import { useDataService } from '@/composables/useDataService'
import { useRecipeStore } from '@/stores/recipe'
import { useShoppingListStore } from '@/stores/shoppingList'
import { LocalUser } from '@/types/UserState'

const appStore = useAppStore()
const userStore = useUserStore()
const recipeStore = useRecipeStore()
const shoppingListStore = useShoppingListStore()
const dataService = useDataService()
const isTestModeOn = computed(() => appStore.isTestModeOn)
const isAuthorized = computed(() => userStore.isAuthorized)
const currentUser = computed(() => userStore.getCurrentUser)

function testModeOff() {
  appStore.turnTestModeOff()
  userStore.deauthorize()
  router.push('/')
}

function onClickRegisterSigning(type: string) {
  appStore.toggleRegistrationModal(type)
}

async function onSave() {
  if (currentUser.value) {
    const updateUser: LocalUser = {...currentUser.value, recipes: recipeStore.recipes, shoppingLists: shoppingListStore.shoppingLists, personalFilters: recipeStore.personalFilters}
    try {
      dataService.saveUserData(updateUser)
    } catch (error: any) {
      // TODO: handle & display errors
      console.log('Error during Saving:', error)
    }
  }
}

function onReset() {
  console.log('fetched')
}

async function onSignOut() {
  if (!appStore.isTestModeOn) {
    const auth = getAuth()

    try {
      await signOut(auth)
      console.log('signed out of firebase')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  } else {
    testModeOff()
  }
  appStore.resetAppStates()
  router.push('/')
}
</script>

<template>
  <ul class="nav navbar-nav">
    <li routerLinkActive="active" class="nav-recipes" v-if="isTestModeOn || isAuthorized">
      <RouterLink class="nav-menu-item" to="recipes" @click="$emit('mobileModalClose')"
        >Recipes</RouterLink
      >
    </li>
    <li routerLinkActive="active" class="nav-shopping-list" v-if="isTestModeOn || isAuthorized">
      <RouterLink class="nav-menu-item" to="shopping-lists" @click="$emit('mobileModalClose')"
        >Shopping Lists</RouterLink
      >
    </li>
    <li v-if="isTestModeOn" @click="testModeOff" class="test-text-contain">
      <span class="test-text nav-menu-item" @click="$emit('mobileModalClose')">Test Mode Off</span>
    </li>
  </ul>
  <ul class="nav navbar-nav rightward">
    <div class="nav-menu-items" v-if="!isAuthorized && !isTestModeOn">
      <li>
        <a class="nav-menu-item" style="cursor: pointer" @click="onClickRegisterSigning('register')"
          >Register</a
        >
      </li>
      <li class="sign-in-button">
        <a class="nav-menu-item" style="cursor: pointer" @click="onClickRegisterSigning('signin')"
          >Sign In</a
        >
      </li>
    </div>
    <div class="nav-menu-items" v-if="isTestModeOn || isAuthorized">
      <li class="nav-menu-item">
        <a @click="onSignOut()" style="cursor: pointer" routerLink="/">Log Out</a>
      </li>
      <li class="dropdown nav-menu-item" appDropdown>
        <a style="cursor: pointer" class="dropdown-toggle" role="button"
          >Manage <span class="caret"></span
        ></a>
        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-menu-item" style="cursor: pointer" @click="onSave()"
              >Save Data</a
            >
          </li>
          <li>
            <a class="dropdown-menu-item" style="cursor: pointer" @click="onReset()">Reset Data</a>
          </li>
        </ul>
      </li>
    </div>
  </ul>
</template>

<style lang="sass">
.navbar-nav
    display: flex
    flex-direction: column
    padding: 0
    margin: 0
    list-style-type: none

    @media (min-width: 768px)
        flex-direction: row
        align-items: center

.test-text
    display: block
    align-items: center
    cursor: pointer

    &:hover
        color: #333

.nav-menu-items
    display: flex
    flex-direction: column

    @media (min-width: 768px)
        flex-direction: row

.nav-menu-item
    position: relative
    display: flex
    flex-direction: column
    text-decoration: none
    padding: 0 10px
    font-size: 1.2em

    &:hover
        text-decoration: underline


.rightward
    margin-top: 15px

    @media (min-width: 768px)
        margin-right: 30px

.dropdown
    position: relative

    &:hover
        background-color: #eee

    &:hover .dropdown-menu
        display: block

.dropdown-menu
    display: none
    position: absolute
    top: 100%
    left: 0%
    background: white
    padding: 15px 0
    list-style-type: none
    width: 120%

.dropdown-toggle
    display: block

.dropdown-menu-item
    display: flex
    align-items: center
    text-decoration: none
    font-size: 0.9em
    // padding-left: 5px
    padding: 5px 5px

    &:hover
        background-color: #eee
</style>
