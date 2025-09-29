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
      'fixed top-0 right-0 h-full w-64 bg-surface transform transition-all duration-300 z-20',
      menuClassChanges
    ]">
    <XToCloseComponent @close="closeMobileMenu" />
    <ul class="flex flex-col text-primary mt-10 p-5 items-end text-4xl font-brand">
      <li class="hover:text-accent" v-if="isAuthorized">
        <RouterLink to="shopping-lists" @click="closeMobileMenu">Search</RouterLink>
      </li>
      <li class="hover:text-accent mt-5" v-if="isAuthorized">
        <RouterLink to="shopping-lists" @click="closeMobileMenu">Recipes</RouterLink>
      </li>
      <li class="hover:text-accent mt-5" v-if="isAuthorized">
        <RouterLink to="shopping-lists" @click="closeMobileMenu">Shopping Lists</RouterLink>
      </li>
      <li class="relative mt-5" v-if="isAuthorized">
        <a class="cursor-pointer" @click="onSignOut()" routerLink="/">Meal Planner</a>
        <div
          class="p-1 absolute top-[50%] -translate-y-1/2 left-[50%] -translate-x-1/2 text-xs text-center bg-accent rounded-sm opacity-90 text-[#152547]">
          (Coming Soon)
        </div>
      </li>
      <li class="hover:text-accent mt-5" v-if="isAuthorized">
        <a class="cursor-pointer" @click="onSignOut()" routerLink="/">Log Out</a>
      </li>
      <li class="hover:text-accent" v-if="!isAuthorized">
        <a class="cursor-pointer" @click="openAuthModal('signin')">Sign In</a>
      </li>
      <li class="hove:text-accent mt-5" v-if="!isAuthorized">
        <a class="cursor-pointer" @click="openAuthModal('register')">Register</a>
      </li>
    </ul>
  </div>
</template>
