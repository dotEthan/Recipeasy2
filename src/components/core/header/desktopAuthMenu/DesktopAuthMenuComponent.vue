<script setup lang="ts">
/**
 * Component for the Desktop authorization elements
 * @todo should be buttons?
 * @example
 * <DesktopAuthMenuComponent />
 */
import { computed } from "vue";

import { useAuthService } from "@/composables/useAuthService";
import router from "@/router/main";
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";

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
</script>

<template>
  <ul class="flex flex-row items-center">
    <li v-if="isAuthorized">
      <a class="cursor-pointer" @click="onSignOut()" routerLink="/">Log Out</a>
    </li>
    <li class="mr-3 text-base lg:text-lg" v-if="!isAuthorized">
      <a class="cursor-pointer" @click="openAuthModal('signin')"
        ><span class="text-accent">></span> Sign In</a
      >
    </li>
    <li v-if="!isAuthorized">
      <a
        class="p-1 lg:p-1.5 rounded-sm bg-accent text-primary md:text-[#152547] cursor-pointer text-base lg:text-lg"
        @click="openAuthModal('register')"
        >Register</a
      >
    </li>
  </ul>
</template>
