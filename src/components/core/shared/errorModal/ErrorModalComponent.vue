<script setup lang="ts">
import { useErrorStore } from "@/stores/errorStore";
import { useModalStore } from "@/stores/modalStore";

import AppModalComponent from "../appModal/AppModalComponent.vue";

const modalStore = useModalStore();
const errorStore = useErrorStore();
function onModalClose() {
  errorStore.hideCriticalErrorModal();
}
</script>

<template>
  <AppModalComponent :backdrop="true" @close="onModalClose">
    <div class="critical-error-modal">
      <div class="error-header">
        <h2 class="error-title">Critical Error</h2>

        <p class="error-code" v-if="errorStore.currentModalError.errorCode">
          Error Code: {{ errorStore.currentModalError.errorCode }}
        </p>
      </div>

      <div class="error-content">
        <p class="error-message">{{ errorStore.currentModalError.message }}</p>
      </div>

      <div class="error-actions">
        <button
          v-if="errorStore.currentModalError.showRetry"
          @click="errorStore.currentModalError.onRetry()"
          class="btn btn-primary">
          Retry
        </button>
        <button
          v-if="errorStore.currentModalError.showCancelNoRevert"
          @click="errorStore.hideCriticalErrorModal"
          class="btn btn-secondary">
          Cancel (Keep Changes)
        </button>
        <button
          v-if="errorStore.currentModalError.showCancel"
          @click="modalStore.handleCancel"
          class="btn btn-warning">
          Cancel (Revert Changes)
        </button>
        <button
          v-if="errorStore.currentModalError.showReport"
          @click="modalStore.handleReport"
          class="btn btn-info">
          Report Issue
        </button>
        <button @click="onModalClose" class="btn btn-ghost">Dismiss</button>
      </div>
    </div>
  </AppModalComponent>
</template>

<style lang="sass" scoped>
.critical-error-modal
  padding: 1.5rem
  max-width: 500px
  width: 100%

.error-header
  margin-bottom: 1rem
  text-align: center

.error-title
  color: #dc2626
  font-size: 1.5rem
  font-weight: 600
  margin: 0 0 0.5rem 0

.error-code
  color: #6b7280
  font-size: 0.875rem
  margin: 0
  font-family: monospace

.error-content
  margin-bottom: 1.5rem
  padding: 1rem
  background-color: #fef2f2
  border-left: 4px solid #dc2626
  border-radius: 0.375rem

.error-message
  color: #374151
  line-height: 1.5
  margin: 0

.error-actions
  display: flex
  flex-wrap: wrap
  gap: 0.75rem
  justify-content: center

.btn
  padding: 0.5rem 1rem
  border: none
  border-radius: 0.375rem
  font-weight: 500
  cursor: pointer
  transition: all 0.2s
  min-width: 120px

.btn:hover
  transform: translateY(-1px)

.btn-primary
  background-color: #3b82f6
  color: white

.btn-primary:hover
  background-color: #2563eb

.btn-secondary
  background-color: #6b7280
  color: white

.btn-secondary:hover
  background-color: #4b5563

.btn-warning
  background-color: #f59e0b
  color: white

.btn-warning:hover
  background-color: #d97706

.btn-info
  background-color: #06b6d4
  color: white

.btn-info:hover
  background-color: #0891b2

.btn-ghost
  background-color: transparent
  color: #6b7280
  border: 1px solid #d1d5db

.btn-ghost:hover
  background-color: #f9fafb
  color: #374151
</style>
