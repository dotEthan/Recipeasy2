<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/appStore';
import { useUserStore } from '@/stores/userStore';
import router from '@/router/main';
import { useAuthService } from '@/composables/useAuthService';

const appStore = useAppStore();
const userStore = useUserStore();
const authService = useAuthService();
const isAuthorized = computed(() => userStore.isAuthorized);


function onClickRegisterSigning(type: string) {
  closeMobileMenu();
  appStore.setAuthModalType(type);
}

async function onSave() {
  // TODO manuals aving removed till offline functionality
  closeMobileMenu();
}

function onReset() {
  console.log("reset");
}

async function onSignOut() {
  closeMobileMenu()
  try {
    await authService.logOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
  router.push('/');
};

function closeMobileMenu() {
  appStore.isMobileMenuOpen = false;
}
</script>

<template>
  <ul class="nav navbar-nav">
    <li routerLinkActive="active" class="nav-recipes" v-if="isAuthorized">
      <RouterLink class="nav-menu-item" to="recipes" @click="closeMobileMenu"
        >Recipes</RouterLink
      >
    </li>
    <li routerLinkActive="active" class="nav-shopping-list" v-if="isAuthorized">
      <RouterLink class="nav-menu-item" to="shopping-lists" @click="closeMobileMenu"
        >Shopping Lists</RouterLink
      >
    </li>
  </ul>
  <ul class="nav navbar-nav rightward">
    <div class="nav-menu-items" v-if="isAuthorized">
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
    <div class="nav-menu-items" v-if="!isAuthorized">
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
  </ul>
</template>

<style lang="sass" scoped>
.navbar-nav
    display: flex
    flex-direction: column
    padding: 0
    margin: 0
    list-style-type: none

    @media (min-width: 768px)
        flex-direction: row
        align-items: center

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
    padding: 5px 10px

    &:hover
        text-decoration: underline


.rightward

    @media (min-width: 768px)
      margin-top: 15px
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
    // font-size: 0.9em
    // padding-left: 5px
    padding: 5px 5px

    &:hover
        background-color: #eee
</style>
