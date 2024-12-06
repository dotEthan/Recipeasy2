<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import XToCloseComponent from '../../shared/xToClose/XToCloseComponent.vue';

const appStore = useAppStore()
const emit = defineEmits(['close'])

function onClose() {
  appStore.toggleRegistrationModal()
  emit('close')
}
</script>

<template>
    <div class="modal-contain">
        <div class="modal">
            <XToCloseComponent @close="onClose" />
            <slot></slot>
        </div>
    </div>
</template>

<style lang="sass" scoped>
@import '../../../../assets/variables.sass'
.modal-contain
    position: absolute
    left: 0
    width: 100%
    height: calc(100vh - #{$navbar-height-minus})
    z-index: 99
    justify-content: center
    align-items: center
    display: flex
    justify-content: center
    align-items: center

.modal
    background: white
    width: 80vw
    height: calc(80vh - $navbar-height)
    position: relative
    border-radius: 15px
    box-shadow: 2px 3px 10px 1px rgba(0,0,0,.3)
    padding: 0 25px

    @media (min-width: 1024px)
      width: 350px
      height: 400px
    
.close
    position: absolute
    top: 15px
    right: 15px
    width: 25px
    height: 25px
    z-index: 99

</style>