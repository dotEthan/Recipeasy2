<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const appStore = useAppStore()
const userStore = useUserStore()
const isTestModeOn = appStore.isTestModeOn
const isAuthorized = userStore.isAuthorized


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
          <h4>Register Today or click here to test the app with reduced functionality!</h4>
          <span>(No saving data or using API features)</span>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *

.container
  position: relative


.titleback
  display: flex
  flex-direction: column
  align-items: center
  padding: 5px 10px
  border-radius: 10px
  text-align: center
  transform: translateY(0)
  width: 100%

  @media (min-width: 768px)
    transform: translateY(-10%)
    padding: 15px 30px

  h1
    font-family: 'Pacifico', cursive
    margin-bottom: 10px

    @media (min-width: 768px)
      margin-bottom: 25px

  h4
    margin-bottom: 0
    font-size: 0.6rem

    @media (min-width: 768px)
      font-size: 1rem

  span
    margin-top: 5px
    font-size: .6rem

    @media (min-width: 768px)
     font-size: .8rem

.app-title
  margin-bottom: 25px
  font-size: 2em

  @media (min-width: 768px)
    font-size: 4em



.testmode-btn
  padding: 5px
  max-width: 200px
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
