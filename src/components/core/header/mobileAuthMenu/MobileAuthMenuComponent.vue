<script setup lang="ts">
/**
 * Component for the mobile authorization slider
 * @example
 * <MobileAuthMenuComponent />
 */
import { computed } from "vue";

import { useAuthService } from "@/composables/useAuthService";
import router from "@/router/main";
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";

import XToCloseComponent from "../../shared/xToClose/XToCloseComponent.vue";

const appStore = useAppStore();
const userStore = useUserStore();
const authService = useAuthService();
const isAuthorized = computed(() => userStore.isAuthorized);

async function onSignOut() {
  closeMobileMenu();
  try {
    await authService.logOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
  router.push("/");
}

function closeMobileMenu() {
  appStore.isMobileMenuOpen = false;
}

function openAuthModal(type: string) {
  closeMobileMenu();
  appStore.setAuthModalType(type);
}

const menuClassChanges = computed(() => {
  return appStore.isMobileMenuOpen
    ? `translate-x-0 pointer-events-auto visible`
    : `translate-x-full pointer-events-none invisible`;
});
</script>

<template>
  <div
    :class="[
      'fixed top-0 right-0 h-full w-64 bg-surface transform transition-all duration-300 z-30',
      menuClassChanges
    ]">
    <XToCloseComponent @close="closeMobileMenu" />
    <ul class="flex flex-col text-primary mt-13 items-center text-4xl font-brand">
      <li class="" v-if="isAuthorized">
        <a class="cursor-pointer" @click="onSignOut()" routerLink="/">Log Out</a>
      </li>
      <li class="mb-5 md:mb-0" v-if="!isAuthorized">
        <a class="cursor-pointer" @click="openAuthModal('signin')">Sign In</a>
      </li>
      <li v-if="!isAuthorized">
        <a class="cursor-pointer" @click="openAuthModal('register')">Register</a>
      </li>
    </ul>
  </div>
</template>
