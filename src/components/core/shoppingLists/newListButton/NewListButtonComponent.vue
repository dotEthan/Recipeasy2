<script setup lang="ts">
import { useShoppingListStore } from '@/stores/shoppingList'

const emits = defineEmits(['addNewList'])

const shoppingListStore = useShoppingListStore()

function onAddNewList() {
  emits('addNewList')
  shoppingListStore.addList()
}
</script>

<template>
  <div class="sl-empty-space" @click="onAddNewList()">
    <span class="add-new-text">NEW</span>
    <div class="add-new-sl-contain">
      <div class="add-new-sl-button"></div>
    </div>
    <span class="add-new-text">LIST</span>
  </div>
</template>

<style lang="sass"></style>
