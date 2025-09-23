<script setup lang="ts">
/**
 * Component for the header's navigation elements
 * @todo decide on final manual VS auto save. hybrid? PWA?
 * @example
 * <NavMenuComponent />
 */
import { useAppStore } from "@/stores/appStore";

const appStore = useAppStore();

function closeMobileMenu() {
  appStore.isMobileMenuOpen = false;
}
</script>

<template>
  <ul class="flex flex-row items-center grow-1 justify-around md:justify-center text-base">
    <li routerLinkActive="active" class="hidden sm:block md:ml-5">
      <RouterLink class="hover:underline hover:text-accent" to="/" @click="closeMobileMenu"
        >Search</RouterLink
      >
    </li>
    <li routerLinkActive="active" class="md:ml-5">
      <RouterLink class="hover:underline hover:text-accent" to="recipes" @click="closeMobileMenu"
        >Recipes</RouterLink
      >
    </li>
    <li routerLinkActive="active" class="hidden md:block ml-5">
      <RouterLink
        class="hover:underline hover:text-accent"
        to="shopping-lists"
        @click="closeMobileMenu"
        >Shopping Lists</RouterLink
      >
    </li>
    <li routerLinkActive="active" class="hidden md:block ml-5">
      <RouterLink
        class="relative text-gray-400 nav-menu-item cursor-default"
        to="#"
        @click="closeMobileMenu">
        Meal Planner
        <div
          class="p-1 absolute -top-1 -right-2 text-xs text-center bg-accent rounded-sm opacity-70 text-[#152547]">
          (Coming Soon)
        </div>
      </RouterLink>
    </li>
  </ul>
</template>

<style lang="sass" scoped>

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
