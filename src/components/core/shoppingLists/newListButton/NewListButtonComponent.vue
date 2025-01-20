<script setup lang="ts">
import { useShoppingListStore } from '@/stores/shoppingList'
import { CirclePlus } from 'lucide-vue-next';

const shoppingListStore = useShoppingListStore()

function onAddNewList() {
  shoppingListStore.addNewList()
}
</script>

<template>
  <div class="sl-each-contain">
    <div class="new-list-container" @click="onAddNewList()">
      <div class="new-list-text">NEW</div>
      <CirclePlus class="new-list-icon" :size="50" />
      <div class="new-list-text">LIST</div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *

.sl-each-contain
  display: flex
  flex-direction: column
  width: 250px
  height: 350px

.new-list-container
  height: 100%
  border: 2px solid $colorMiddle
  border-radius: 5px
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  cursor: pointer

  .new-list-text, .new-list-icon
    color: $colorMiddle

  &:hover
    border: 2px solid $colorDarkest

    .new-list-text, .new-list-icon
      color: $colorDarker
     
.new-list-text
  font-size: 1.7em
  margin: 10px 0
  font-weight: 500
  
</style>
