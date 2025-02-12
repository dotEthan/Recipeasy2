<script setup lang="ts">
import { ToastClose, ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'radix-vue'
import { onMounted, ref } from 'vue';

const props = defineProps({
  title: String,
  description: String,
  isErrorWarning: Boolean,
  position: {
    type: String,
    default: 'bottom-right',
  },
  hotkeyAnnouncementExpiry: {
    type: Number,
    default: 10 * 60 * 1000 // 10 minutes in milliseconds
  }
})

const hasAnnouncedHotkey = ref<boolean>(false);


onMounted(() => {
  // Ensure Toast Hotkey notification isn't too often
  const lastAnnounced = localStorage.getItem('toastHotkeyAnnounced')
  const xMinutesAgo = Date.now() - props.hotkeyAnnouncementExpiry
  
  if (!lastAnnounced || parseInt(lastAnnounced) < xMinutesAgo) {
    hasAnnouncedHotkey.value = false
    localStorage.setItem('toastHotkeyAnnounced', props.hotkeyAnnouncementExpiry.toString())
  } else {
    hasAnnouncedHotkey.value = true
  }
})
</script>

<template>
  <Teleport to="body">
    <ToastProvider>
      <div v-if="!hasAnnouncedHotkey" aria-live="polite" class="sr-only">
        Press Alt + T to view notifications.
      </div>
      <ToastRoot :type="isErrorWarning ? 'foreground' : 'background'" class="toast-root" as="div">
        <ToastTitle>
          {{ props.title }}
        </ToastTitle>
        <ToastDescription>{{ description }}</ToastDescription>
        <ToastClose aria-label="Close">
          <span aria-hidden>×</span>
        </ToastClose>
      </ToastRoot>

      <ToastViewport :class="['toast-viewport', position]" :hotkey="['altKey', 'KeyT']" as="div" />
    </ToastProvider>
  </Teleport>
</template>


<style lang="sass" scoped>

.toast-viewport 
  position: fixed
  padding: 1rem
  width: 390px
  max-width: 100vw
  z-index: 100

.toast-viewport.top-right 
  top: 0
  right: 0

.toast-viewport.bottom-right 
  bottom: 0
  right: 0

.toast-root 
  background: white
  border-radius: 6px
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
  padding: 1rem
  display: grid
  gap: 0.5rem
  position: relative

</style>