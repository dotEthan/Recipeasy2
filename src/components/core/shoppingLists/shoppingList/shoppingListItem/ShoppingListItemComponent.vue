<script setup lang="ts">
import { useShoppingListStore } from '@/stores/shoppingListStore'

const props = defineProps({
  item: String,
  itemIndex: {
    type: Number,
    default: -1
  },
  listIndex: {
    type: Number,
    default: -1
  }
})

const shoppingListStore = useShoppingListStore()

function onEditItem() {
  shoppingListStore.setEditingListIndex(props.listIndex)
  shoppingListStore.setEditingItemIndex(props.itemIndex)
}
function onDeleteItem() {
  shoppingListStore.deleteListItem(props.listIndex, props.itemIndex)
}
</script>
<template>
  <div class="sl-ingredient">
    <div class="sl-ingredient-name" @click="onEditItem()">{{ item }}</div>
    <div class="ingredient-delete" @click="onDeleteItem()"></div>
  </div>
</template>
<style lang="sass" scoped>

.sl-ingredient
  display: flex
  justify-content: space-between
  align-items: center

.sl-ingredient-name
  width: 100%

.ingredient-delete
  width: 25px
  height: 25px
  position: relative
  cursor: pointer

  &:before, &:after
    content: ''
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%) rotate(45deg)
    background: #A41C1C

  &:before
    width: 2px
    height: 15px

  &:after
    width: 15px
    height: 2px
</style>
