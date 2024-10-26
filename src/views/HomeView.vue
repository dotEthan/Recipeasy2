<script setup lang="ts">
import SplashComponent from '@/components/core/splash/SplashComponent.vue'
import WelcomeComponent from '@/components/core/welcome/WelcomeComponent.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const appStore = useAppStore()
const userStore = useUserStore()
</script>

<template>
  <SplashComponent v-if="!appStore.isTestModeOn && !userStore.isAuthorized" />
  <WelcomeComponent v-else />
</template>

<style lang="sass"></style>
