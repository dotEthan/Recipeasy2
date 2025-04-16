<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import HeaderComponent from './components/core/header/HeaderComponent.vue'
import { useAppService } from '@/composables/useAppService'
import { useAppStore } from './stores/app'

console.log('app loading')
const appService = useAppService();
const appStore = useAppStore();

appStore.initializeApp();

// TODO changes coming with Express update
onMounted(() => {
  window.addEventListener('beforeunload', appService.handleUnsavedChanges);
})
onUnmounted(() => {
  window.removeEventListener('beforeunload', appService.handleUnsavedChanges);
})

// TODO Once at start (needed?)
appService.onResize()

</script>

<template>
  <HeaderComponent />
  <div class="home-container fullbackground">
    <div class="router-contain">
      <RouterView />
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *

.home-container
  width: 100%
  height: 100vh * 0.75


.fullbackground
  height: calc(100vh - $navbar-height)
  display: flex
  align-items: center
  justify-content: center
  background: url('https://res.cloudinary.com/dotethan/image/upload/v1731356238/Recipeasy/main.jpg') no-repeat center top
  background-size: cover

  &:before
    content: ''
    position: absolute
    top: 75px
    left: 0
    width: 100%
    height: calc(100vh - $navbar-height)
    background: rgba(0, 0, 0, 0.6)


.router-contain
  position: absolute
  top: $navbar-height
  left: 0
  width: 100%
  height: calc(100vh - #{$navbar-height-minus})
  display: flex
  justify-content: center
  align-items: center
  overflow: hidden
</style>
