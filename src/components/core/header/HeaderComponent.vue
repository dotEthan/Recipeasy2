<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import MenuBurger from '@/components/core/header/menuBurger/MenuBurger.vue'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'
import router from '@/router'
import NavMenuComponent from './navMenu/NavMenuComponent.vue'

const appDataStore = useAppStore()
const { isTestModeOn, isAuthorized } = storeToRefs(appDataStore)

let isMobileMenuActive = ref(false)

function onPageChange() {
  console.log('pagechange')
  // this.authService.modalOpen.next(false)
  // if (this.headerMenu.nativeElement.classList.contains('active')) this.onMobileMenuClick()
}

function onMobileMenuClick() {
  console.log('mobilemenu')
  // this.$refs.headerMenu.nativeElement.classList.toggle('active')
  // this.$refs.beyondBurger.nativeElement.children[0].classList.toggle('active')
  // const childLength = this.beyondBurger.nativeElement.children[0].children.length
  // for (let i = 0 i < childLength i++) {
  //     this.$refs.beyondBurger.nativeElement.children[0].children[i].classList.remove('stopped')
  // }
}

function testModeOff() {
  appDataStore.turnTestModeOff()
  appDataStore.deauthorize()
  router.push('/')
}

function unhideMobileMenu() {
  isMobileMenuActive.value = !isMobileMenuActive.value
}
</script>

<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid nav__container" appMenuClose>
      <div class="navbar-brand-contain">
        <RouterLink class="navbar-brand" to="/">Recipeasy</RouterLink>
      </div>
      <MenuBurger @mobileMenuClicked="unhideMobileMenu()" />
      <div
        class="navbar-default nav__header"
        :class="{ active: isMobileMenuActive }"
        ref="headermenu"
      >
        <NavMenuComponent />
      </div>
    </div>
  </nav>
</template>

<style lang="sass">
@import '../../../assets/variables.sass'
.navbar
  margin-bottom: 0
  width: 100%

.navbar-default
  background-color: white

.nav__container
  height: $navbar-height
  display: flex
  align-items: center

.navbar-brand-contain
  flex-grow: 1

  @media (min-width: 768px)
    flex-grow: 0

.navbar-brand
  float: left
  height: 50px
  padding: 15px
  color: #777
  text-decoration: none
  font-size: 24px
  font-family: 'Pacifico', cursive
  line-height: 20px

  &:hover
    color: #555

  @media (min-width: 768px)
    font-size: 30px
    margin-left: 25px

.nav__header
  position: absolute
  top: 75px
  left: 100vw
  display: flex
  flex-direction: column
  padding: 25px
  transition: all 0.5s ease-in-out
  width: 40vw
  background-color: white
  z-index: 1
  box-shadow: -2px 2px 2px -1px #666

  &.active
    left: 60vw

  @media (min-width: 560px)
    width: 25vw

    &.active
      left: 75vw

  @media (min-width: 768px)
    position: relative
    left: 0
    top: 0
    justify-content: space-between
    flex-grow: 1
    flex-direction: row
    padding: 0
    border: none
    border-top-color: currentcolor
    border-right-color: currentcolor
    border-bottom-color: currentcolor
    border-left-color: currentcolor
    width: auto
    box-shadow: none
</style>
