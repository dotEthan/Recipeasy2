<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app';

const appStore = useAppStore() 

const afterFirst = ref(false)

function onMobileMenuClick() {
  if (!afterFirst.value) afterFirst.value = true
  appStore.isMobileMenuOpen = !appStore.isMobileMenuOpen
}
</script>

<template>
  <div class="beyond-burger" @click="onMobileMenuClick()">
    <div class="burger-container" :class="{ active: appStore.isMobileMenuOpen }">
      <div
        v-for="(n, index) in 3"
        :key="index"
        :class="[`line${index + 1}`,
        !afterFirst ? 'stopped' : '']"
      ></div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *

.beyond-burger
  position: relative
  display: block
  width: 50px
  height: 50px
  cursor: pointer

  @media (min-width: 768px)
    display: none

  &:hover
    .line1,
    .line2,
    .line3
      background: #333

.burger-container
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  width: 25px
  height: $iconheight

  .line1
    animation: firstline--back .5s

  .line2
    margin: $spaceheight 0
    animation: secondline--back .5s

  .line3
    animation: thirdline--back .5s

  &.active
    .line1
      animation: firstline .5s forwards

    .line2
      animation: secondline .5s forwards

    .line3
      animation: thirdline .5s forwards

.line1,
.line2,
.line3
  height: $lineheight
  background: #666
  border-radius: 2px

  &:hover
    background: #333

.stopped
  -webkit-animation: none
  animation: none !important

@keyframes firstline
  0%
    transform: translateY(0)

  50%
    transform: translateY($lineoneoffset)

  100%
    transform: translateY($lineoneoffset) rotate(45deg)

@keyframes secondline
  0%
    transform: scale(1)

  50%
    transform: scale(0)

  100%
    transform: scale(0)

@keyframes thirdline
  0%
    transform: translateY(0)

  50%
    transform: translateY(-$lineoneoffset)

  100%
    transform: translateY(-$lineoneoffset) rotate(-45deg)

@keyframes firstline--back
  0%
    transform: translateY($lineoneoffset) rotate(45deg)

  50%
    transform: translateY($lineoneoffset) rotate(0deg)

  100%
    transform: translateY(0)

@keyframes secondline--back
  0%
    transform: scale(0)

  50%
    transform: scale(0)

  100%
    transform: scale(1)

@keyframes thirdline--back
  0%
    transform: translateY(-$lineoneoffset) rotate(-45deg)

  50%
    transform: translateY(-$lineoneoffset) rotate(0deg)

  100%
    transform: translateY(0)
</style>
