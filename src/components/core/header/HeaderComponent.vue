<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import MenuBurger from '@/components/core/header/MenuBurger/MenuBurger.vue'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'
import router from '@/router'

const appDataStore = useAppStore()
const { isTestModeOn, isAuthorized } = storeToRefs(appDataStore)

function onPageChange() {
  console.log('pagechange')
  // this.authService.modalOpen.next(false);
  // if (this.headerMenu.nativeElement.classList.contains('active')) this.onMobileMenuClick();
}

function onMobileMenuClick() {
  console.log('mobilemenu')
  // this.$refs.headerMenu.nativeElement.classList.toggle('active');
  // this.$refs.beyondBurger.nativeElement.children[0].classList.toggle('active');
  // const childLength = this.beyondBurger.nativeElement.children[0].children.length;
  // for (let i = 0; i < childLength; i++) {
  //     this.$refs.beyondBurger.nativeElement.children[0].children[i].classList.remove('stopped');
  // }
}

function testModeOff() {
  appDataStore.turnTestModeOff()
  appDataStore.deauthorize()
  router.push('/')
}

function onSave() {
  console.log('saved')
  // this.store.dispatch(new RecipeActions.StoreRecipes());
  // this.store.dispatch(new ShoppingListActions.StoreShoppingLists());
}

function onFetch() {
  console.log('fetched')
  // this.store.dispatch(new RecipeActions.FetchRecipes());
}

function onModalOpen(type: string) {
  console.log('open modal')
  // this.authService.authType.next(type);
  // this.authService.modalOpen.next(true);
  // this.authService.errorMsg.next({ code: '', message: '' });
}

function authLogout() {
  appDataStore.deauthorize()
  appDataStore.turnTestModeOff()
  router.push('/')
}
</script>

<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid nav__container" appMenuClose>
      <div class="navbar-brand-contain">
        <RouterLink class="navbar-brand" to="/">Recipeasy</RouterLink>
      </div>
      <MenuBurger />
      <div class="navbar-default nav__header" ref="headermenu">
        <ul class="nav navbar-nav">
          <div class="nav-menu-items" v-if="isTestModeOn || isAuthorized">
            <li routerLinkActive="active" class="nav-recipes">
              <RouterLink class="nav-menu-item" to="/recipes">Recipes</RouterLink>
            </li>
            <li routerLinkActive="active" class="nav-shopping-list">
              <RouterLink class="nav-menu-item" to="/shopping-list">Shopping List</RouterLink>
            </li>
          </div>
          <div v-if="isTestModeOn">
            <li @click="testModeOff" class="test-text-contain">
              <span class="test-text nav-menu-item">Test Mode Off</span>
            </li>
          </div>
        </ul>
        <ul class="nav navbar-nav rightward">
          <div class="nav-menu-items" v-if="!isAuthorized && !isTestModeOn">
            <li>
              <a class="nav-menu-item" style="cursor: pointer" @click="onModalOpen('register')"
                >Register</a
              >
            </li>
            <li class="sign-in-button">
              <a class="nav-menu-item" style="cursor: pointer" @click="onModalOpen('signin')"
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
                  <a class="dropdown-menu-item" style="cursor: pointer" @click="onFetch()"
                    >Fetch Data</a
                  >
                </li>
              </ul>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style lang="scss">
@import '../../../assets/variables.scss';
.navbar {
  margin-bottom: 0;
  width: 100%;
}

.nav__container {
  height: $navbar-height;
  display: flex;
  align-items: center;
}

.navbar-brand-contain {
  flex-grow: 1;

  @media (min-width: 768px) {
    flex-grow: 0;
  }
}

.navbar-brand {
  float: left;
  height: 50px;
  padding: 15px;
  color: #777;
  text-decoration: none;
  font-size: 24px;
  font-family: 'Pacifico', cursive;
  line-height: 20px;

  &:hover {
    color: #555;
  }

  @media (min-width: 768px) {
    font-size: 30px;
    margin-left: 25px;
  }
}

.nav__header {
  position: absolute;
  top: $navbar-height;
  left: 100vw;
  display: flex;
  flex-direction: column;
  padding: 25px;
  transition: all 0.5s ease-in-out;
  width: 40vw;
  // z-index: 1;
  box-shadow: -2px 2px 2px -1px #666;

  &.active {
    left: 60vw;
    // z-index: 99;
  }

  @media (min-width: 560px) {
    width: 25vw;

    &.active {
      left: 75vw;
    }
  }

  @media (min-width: 768px) {
    position: relative;
    left: 0;
    top: 0;
    justify-content: space-between;
    flex-grow: 1;
    flex-direction: row;
    padding: 0;
    border: none;
    width: auto;
    box-shadow: none;
  }
}

.nav__header {
  position: absolute;
  top: 75px;
  left: 100vw;
  display: flex;
  flex-direction: column;
  padding: 25px;
  transition: all 0.5s ease-in-out;
  width: 40vw;
  // z-index: 1;
  box-shadow: -2px 2px 2px -1px #666;

  @media (min-width: 768px) {
    position: relative;
    left: 0;
    top: 0;
    justify-content: space-between;
    flex-grow: 1;
    flex-direction: row;
    padding: 0;
    border: none;
    border-top-color: currentcolor;
    border-right-color: currentcolor;
    border-bottom-color: currentcolor;
    border-left-color: currentcolor;
    width: auto;
    box-shadow: none;
  }
}

.navbar-nav {
  margin: 0;
  list-style-type: none;
  display: flex;
  align-items: center;
}

.nav-menu-items {
  display: flex;
  flex-direction: row;
}

.test-text {
  display: block;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: #333;
  }
}

.nav-menu-item {
  position: relative;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 10px;
  font-size: 1.2em;

  &:hover {
    text-decoration: underline;
  }
}

.rightward {
  margin-right: 30px;
}

.dropdown {
  position: relative;

  &:hover {
    background-color: #eee;
  }

  &:hover .dropdown-menu {
    display: block;
  }
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0%;
  background: white;
  padding: 15px 0;
  list-style-type: none;
  width: 120%;
}

.dropdown-toggle {
  display: block;
  padding: 15px;
}

.dropdown-menu-item {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 0.9em;
  // padding-left: 5px;
  padding: 5px 5px;

  &:hover {
    background-color: #eee;
  }
}
</style>
