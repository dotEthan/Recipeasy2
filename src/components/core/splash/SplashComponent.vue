<script setup lang="ts">
import { computed } from 'vue'
import { UseAppStore } from '@/stores/app'
import { UseUserStore } from '@/stores/user'
import AuthComponent from '../auth/AuthComponent.vue'

const useAppStore = UseAppStore()
const useUserStore = UseUserStore()
const isTestModeOn = useAppStore.isTestModeOn
const isAuthorized = useUserStore.isAuthorized

const isRegistrationModalOpen = computed(() => useAppStore.isRegistrationModalOpen)

console.log('is it on: ', isRegistrationModalOpen.value)
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <div class="titleback">
          <h1 class="app-title">Welcome to Recipeasy</h1>
          <button
            v-if="!isTestModeOn && !isAuthorized"
            @click="useAppStore.turnTestModeOn"
            class="testmode-btn"
            :class="{ testmodeOn: isTestModeOn }"
          >
            Toggle Test Mode
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="attribute">
    <a href="https://nick-karvounis.com/" target="_blank">Photo by Nick Karvounis on Unsplash</a>
  </div>

  <AuthComponent v-if="isRegistrationModalOpen"></AuthComponent>
</template>

<style lang="sass">
@import '../../../assets/variables.sass'

.container
  position: relative


.titleback
  padding: 15px 30px
  border-radius: 10px
  text-align: center
  transform: translateY(0)
  font-family: 'Pacifico', cursive
  color: #f9f9ef
  width: 100%

  @media (min-width: 768px)
    transform: translateY(-10%)



.app-title
  margin-bottom: 50px
  font-size: 2em

  @media (min-width: 768px)
    font-size: 4em



.testmode-btn
  padding: 5px
  color: #666
  font-family: 'Montserrat', sans-serif
  font-weight: bold
  border-radius: 5px
  font-size: 0.8em
  border-color: #eef #898989 #898989 #eef
  background: #eef

  @media (min-width: 768px)
    padding: 10px



.testmode-on
  // background: #666
  background: #ddd
  border-color: #eef #ddd #ddd #eef
  // color: #f9f9ef


.attribute
  position: absolute
  bottom: #{$borderize-margin}
  right: #{$borderize-margin}
  font-size: 0.8rem
  // z-index: 2

  @media (min-width: 768px)
    bottom: #{$borderize-margin * 2}
    right: #{$borderize-margin * 2}
    font-size: 1.2rem


  a
    color: white



.testmode-btn
  padding: 5px
  color: #666
  font-family: 'Montserrat', sans-serif
  font-weight: bold
  border-radius: 5px
  font-size: 0.8em
  border-color: #eef #898989 #898989 #eef
  background: #eef

  @media (min-width: 768px)
    padding: 10px



.testmodeOn
  // background: #666
  background: #ddd
  border-color: #eef #ddd #ddd #eef
  // color: #f9f9ef
</style>
