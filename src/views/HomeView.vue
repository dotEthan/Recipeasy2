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
  <div class="home-container fullbackground">
    <SplashComponent v-if="!isTestModeOn && !isAuthorized" />
    <WelcomeComponent v-else />
  </div>
</template>

<style lang="scss">
@import '../assets/variables.scss';
.home-container {
  width: 100%;
  height: 100vh * 0.75;
}

.fullbackground {
  height: calc(100vh - $navbar-height);
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('../assets/main.jpg') no-repeat center top;
  background-size: cover;
  // z-index: 0;

  &:before {
    content: '';
    position: absolute;
    top: 75px;
    left: 0;
    width: 100%;
    height: calc(100vh - $navbar-height);
    background: rgba(0, 0, 0, 0.6);
    // z-index: 1;
  }
}
</style>
