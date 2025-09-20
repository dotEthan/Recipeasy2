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
  <ul class="flex flex-row items-center grow-1 justify-center">
    <li routerLinkActive="active" class="">
      <RouterLink class="hover:underline nav-menu-item" to="/" @click="closeMobileMenu"
        >Home</RouterLink
      >
    </li>
    <li routerLinkActive="active" class="">
      <RouterLink class="hover:underline nav-menu-item" to="recipes" @click="closeMobileMenu"
        >Recipes</RouterLink
      >
    </li>
    <li routerLinkActive="active" class="nav-shopping-list">
      <RouterLink class="hover:underline nav-menu-item" to="shopping-lists" @click="closeMobileMenu"
        >Shopping Lists</RouterLink
      >
    </li>
    <li routerLinkActive="active" class="nav-shopping-list">
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
    // text-decoration: none
    padding: 5px 10px

    // &:hover
    //     text-decoration: underline


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
