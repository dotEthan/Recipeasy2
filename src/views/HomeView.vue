<script setup lang="ts">
import SplashComponent from '@/components/core/splash/SplashComponent.vue'
import WelcomeComponent from '@/components/core/welcome/WelcomeComponent.vue'
import { UseAppStore } from '@/stores/app'
import { UseUserStore } from '@/stores/user'

const useAppStore = UseAppStore()
const useUserStore = UseUserStore()
</script>

<template>
  <SplashComponent v-if="!useAppStore.isTestModeOn && !useUserStore.isAuthorized" />
  <WelcomeComponent v-else />
</template>

<style lang="sass"></style>
