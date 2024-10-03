<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderComponent from './components/core/header/HeaderComponent.vue'
</script>

<template>
  <HeaderComponent />
  <div class="home-container fullbackground">
    <RouterView />
  </div>
</template>

<style lang="sass">
@import './assets/variables.sass'

.home-container
  width: 100%
  height: 100vh * 0.75


.fullbackground
  height: calc(100vh - $navbar-height)
  display: flex
  align-items: center
  justify-content: center
  background: url('./assets/main.jpg') no-repeat center top
  background-size: cover

  &:before
    content: ''
    position: absolute
    top: 75px
    left: 0
    width: 100%
    height: calc(100vh - $navbar-height)
    background: rgba(0, 0, 0, 0.6)
</style>
