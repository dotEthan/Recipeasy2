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

<style lang="sass" scoped></style>
