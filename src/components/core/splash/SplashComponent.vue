<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import AuthComponent from '../auth/AuthComponent.vue'

const appStore = useAppStore()
const userStore = useUserStore()
const isTestModeOn = appStore.isTestModeOn
const isAuthorized = userStore.isAuthorized

const isRegistrationModalOpen = computed(() => appStore.isRegistrationModalOpen)

</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <div class="titleback">
          <h1 class="app-title">Welcome to Recipeasy</h1>
          <button
            v-if="!isTestModeOn && !isAuthorized"
            @click="appStore.turnTestModeOn"
            class="testmode-btn"
          >
            Toggle Test Mode
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="attribute">
    <h4><a href="https://nick-karvounis.com/" target="_blank">Photo by Nick Karvounis on Unsplash</a></h4>
  </div>

  <AuthComponent v-if="isRegistrationModalOpen"></AuthComponent>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *

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

.attribute
  position: absolute
  bottom: 25px
  right: 25px

  @media (min-width: 768px)
    bottom: 50
    right: 50
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
</style>
