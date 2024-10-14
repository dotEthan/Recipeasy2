<script setup lang="ts">
// eslint-disable-next-line no-unused-vars
import SplashComponent from '@/components/core/splash/SplashComponent.vue'
import WelcomeComponent from '@/components/core/welcome/WelcomeComponent.vue'
import { UseAppStore } from '@/stores/App'
import { UseUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const appDataStore = UseAppStore()
const userStore = UseUserStore()
const isTestModeOn = storeToRefs(appDataStore)
const isAuthorized = storeToRefs(userStore)
</script>

<template>
  <SplashComponent v-if="!isTestModeOn && !isAuthorized" />
  <WelcomeComponent v-else />
</template>

<style lang="sass"></style>
