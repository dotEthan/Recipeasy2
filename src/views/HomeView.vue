<script setup lang="ts">
// eslint-disable-next-line no-unused-vars
import SplashComponent from '@/components/core/splash/SplashComponent.vue'
import WelcomeComponent from '@/components/core/welcome/WelcomeComponent.vue'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

const appDataStore = useAppStore()
const { isTestModeOn, isAuthorized } = storeToRefs(appDataStore)
</script>

<template>
  <SplashComponent v-if="!isTestModeOn && !isAuthorized" />
  <WelcomeComponent v-else />
</template>

<style lang="sass"></style>
