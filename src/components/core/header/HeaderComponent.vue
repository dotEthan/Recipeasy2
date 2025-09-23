<script setup lang="ts">
/**
 * Component for apps header
 * @example
 * <HeaderComponent />
 */
import { computed } from "vue";

import { useScreenSizeService } from "@/composables/useScreenSizeService";
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";

import BrandComponent from "./brand/BrandComponent.vue";
import DarkModeToggleComponentVue from "./darkModeToggle/DarkModeToggleComponent.vue.vue";
import DesktopAuthMenuComponent from "./desktopAuthMenu/DesktopAuthMenuComponent.vue";
import MenuBurgerComponent from "./menuBurger/MenuBurgerComponent.vue";
import MobileAuthMenuComponent from "./mobileAuthMenu/MobileAuthMenuComponent.vue";
import NavMenuComponent from "./navMenu/NavMenuComponent.vue";

const appStore = useAppStore();
const screenSizeService = useScreenSizeService();
const userStore = useUserStore();

const isAuthorized = computed(() => userStore.isAuthorized);

function closeMobileMenu() {
  appStore.isMobileMenuOpen = false;
}
</script>

<template>
  <div class="max-w-[1600px] w-full flex justify-center mx-auto">
    <nav class="h-15 md:h-25 w-full text-xl flex flex-col justify-center">
      <div
        class="grid grid-cols-[1fr_1fr_1fr] xs:grid-cols-[1fr_2fr_1fr] lg:grid-cols-[1fr_2.5fr_1fr] items-center mr-4 ml-4 md:mr-8 md:ml-8 lg:mr-10 lg:ml-10">
        <BrandComponent />
        <div>
          <NavMenuComponent v-if="isAuthorized && screenSizeService.isDesktop" />
          <!-- <NavMenuComponent v-if="isAuthorized & appStore.screenSize === ''" /> -->
        </div>
        <div class="w-full flex flex-row justify-end items-center">
          <DarkModeToggleComponentVue class="mr-2" @clicked="appStore.toggleLightMode" />
          <MenuBurgerComponent />
          <DesktopAuthMenuComponent v-if="!screenSizeService.isMobile.value" />
          <MobileAuthMenuComponent v-if="screenSizeService.isMobile.value" />
        </div>
      </div>
      <div class="w-2/5 h-px mt-4 bg-surface mx-auto" v-if="isAuthorized"></div>
      <div class="w-full flex flex-row justify-between" v-if="!isAuthorized">
        <div class="w-[25%] h-px mt-4 bg-accent"></div>
        <div class="w-[25%] h-px mt-4 bg-accent"></div>
      </div>
    </nav>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *
.nav__container
  height: $navbar-height
  display: flex
  align-items: center
  max-width: 1500px
  margin: auto

.navbar-brand-contain
  flex-grow: 1

  @media (min-width: 768px)
    flex-grow: 0

.navbar-brand
  float: left
  height: 50px
  padding: 15px
  // color: #555
  text-decoration: none
  font-size: 24px
  font-family: 'Limelight', sans-serif
  line-height: 20px

  // &:hover
  //   color: #111

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
