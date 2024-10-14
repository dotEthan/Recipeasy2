<script setup lang="ts">
import { UseAppStore } from '@/stores/App'
import { UseUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import router from '@/router/main'

const useAppStore = UseAppStore()
const useUserStore = UseUserStore()
const { isTestModeOn } = storeToRefs(useAppStore)
const { isAuthorized } = storeToRefs(useUserStore)

const emit = defineEmits(['mobileModalClose', 'yeah'])

function testModeOff() {
  useAppStore.turnTestModeOff()
  useUserStore.deauthorize()
  router.push('/')
}

function onModalOpen(type: string) {
  console.log('open modal: ' + type)
  // this.authService.authType.next(type)
  // this.authService.modalOpen.next(true)
  // this.authService.errorMsg.next({ code: '', message: '' })
}

function onRegisterSaveClick(type: string) {
  onModalOpen(type)
  emit('mobileModalClose')
}

function onSave() {
  console.log('saved')
  // this.store.dispatch(new RecipeActions.StoreRecipes())
  // this.store.dispatch(new ShoppingListActions.StoreShoppingLists())
}

function onFetch() {
  console.log('fetched')
  // this.store.dispatch(new RecipeActions.FetchRecipes())
}

function authLogout() {
  useUserStore.deauthorize()
  useAppStore.turnTestModeOff()
  router.push('/')
}
</script>

<template>
  <ul class="nav navbar-nav">
    <li routerLinkActive="active" class="nav-recipes">
      <RouterLink class="nav-menu-item" to="recipes" @click="$emit('mobileModalClose')"
        >Recipes</RouterLink
      >
    </li>
    <li routerLinkActive="active" class="nav-shopping-list">
      <RouterLink class="nav-menu-item" to="shopping-list" @click="$emit('mobileModalClose')"
        >Shopping List</RouterLink
      >
    </li>
    <li v-if="isTestModeOn" @click="testModeOff" class="test-text-contain">
      <span class="test-text nav-menu-item" @click="$emit('mobileModalClose')">Test Mode Off</span>
    </li>
  </ul>
  <ul class="nav navbar-nav rightward">
    <div class="nav-menu-items" v-if="!isAuthorized && !isTestModeOn">
      <li>
        <a class="nav-menu-item" style="cursor: pointer" @click="onRegisterSaveClick('register')"
          >Register</a
        >
      </li>
      <li class="sign-in-button">
        <a class="nav-menu-item" style="cursor: pointer" @click="onRegisterSaveClick('signin')"
          >Sign In</a
        >
      </li>
    </div>
    <div class="nav-menu-items" v-if="isTestModeOn || isAuthorized">
      <li class="nav-menu-item">
        <a @click="authLogout()" style="cursor: pointer" routerLink="/">Log Out</a>
      </li>
      <li class="dropdown nav-menu-item" appDropdown>
        <a style="cursor: pointer" class="dropdown-toggle" role="button"
          >Manage <span class="caret"></span
        ></a>
        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-menu-item" style="cursor: pointer" @click="onSave()"
              >Save Data (use Radix Vue dropdown)</a
            >
          </li>
          <li>
            <a class="dropdown-menu-item" style="cursor: pointer" @click="onFetch()">Fetch Data</a>
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
