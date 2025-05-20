<script setup lang="ts">
/**
 * Component for apps header
 * @example
 * <HeaderComponent />
 */
import { RouterLink } from "vue-router";

import { useAppStore } from "@/stores/appStore";

import MenuBurgerComponent from "./menuBurger/MenuBurgerComponent.vue";
import NavMenuComponent from "./navMenu/NavMenuComponent.vue";

const appStore = useAppStore();

function closeMobileMenu() {
  appStore.isMobileMenuOpen = false;
}
</script>

<template>
  <nav class="navbar navbar-default">
    <div class="nav__container">
      <div class="navbar-brand-contain">
        <RouterLink class="navbar-brand" @click="closeMobileMenu" to="/">Tastyista</RouterLink>
      </div>
      <MenuBurgerComponent />
      <div
        class="navbar-default nav__header"
        :class="{ active: appStore.isMobileMenuOpen }"
        ref="headermenu"
      >
        <NavMenuComponent />
      </div>
    </div>
  </nav>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *

.navbar
  margin-bottom: 0
  width: 100%

.navbar-default
  background-color: white

.nav__container
  height: $navbar-height
  display: flex
  align-items: center
  max-width: 1366px
  margin: auto

.navbar-brand-contain
  flex-grow: 1

  @media (min-width: 768px)
    flex-grow: 0

.navbar-brand
  float: left
  height: 50px
  padding: 15px
  color: #555
  text-decoration: none
  font-size: 24px
  font-family: 'Limelight', sans-serif
  line-height: 20px

  &:hover
    color: #111

  @media (min-width: 768px)
    font-size: 40px
    margin-left: 25px

.nav__header
  position: fixed
  top: 75px
  right: 0
  transform: translateX(100%)
  display: flex
  flex-direction: column
  padding: 15px
  transition: transform 0.3s ease-in-out
  width: 40vw
  background-color: white
  z-index: 100
  box-shadow: -2px 2px 2px -1px #666
  opacity: 1

  &.active
    transform: translateX(0)

  @media (min-width: 560px)
    width: 25vw
    padding: 25px

    &.active
      transform: translateX(0)

  @media (min-width: 768px)
    position: relative
    top: 0
    transform: none
    justify-content: space-between
    flex-grow: 1
    flex-direction: row
    padding: 0
    border: none
    width: auto
    box-shadow: none
    transition: none
</style>
