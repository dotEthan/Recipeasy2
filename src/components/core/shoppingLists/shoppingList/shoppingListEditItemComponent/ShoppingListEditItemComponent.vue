<script setup lang="ts">
import { useShoppingListStore } from '@/stores/shoppingList'
import { ref, computed } from 'vue'

const shoppingListStore = useShoppingListStore()

const props = defineProps({
  itemIndex: {
    type: Number,
    default: -1
  },
  listIndex: {
    type: Number,
    default: -1
  }
})

const inputValue = computed({
  get: () => shoppingListStore.getItemValue(props.listIndex, props.itemIndex),
  set: (newValue) => {
    shoppingListStore.shoppingLists[props.listIndex].items[props.itemIndex] = newValue
  }
})

let editingItemIndex = '1'

function saveItem() {
  if (!inputValue.value) {
    // TODO Show some reason for deletion on UI
    console.log('no value!')
    shoppingListStore.shoppingLists[props.listIndex].items.splice(-1, 1)
  }
  shoppingListStore.setEditingItemIndex(-1)
  shoppingListStore.setEditingListIndex(-1)
}
</script>
<template>
  <div class="input-row">
    <input type="text" class="ingredient-inplace" v-model="inputValue" v-on:blur="saveItem()" />
    <div class="save-icon" @click="saveItem()" v-if="editingItemIndex !== '-1'">
      <div class="labels"></div>
    </div>
  </div>
</template>

<style lang="sass">
.input-row
    display: flex
    justify-content: space-between

.ingredient-inplace
    width: 80%

.save-icon
    width: 24px
    height: 25px
    background: black
    border-radius: 3px
    position: relative
    cursor: pointer

    &:after
        content: ''
        position: absolute
        top: 0
        right: 0
        width: 0
        height: 0
        border-style: solid
        border-width: 0 .5rem .5rem 0
        border-color: transparent rgb(255,255,255) transparent transparent

    &:hover
        background: green

        .labels:before
            background: green

.labels
    position: absolute
    top: 15%
    left: 50%
    transform: translateX(-50%)
    width: 60%
    height: 30%
    background: white
    border-radius: 2px

    &:before
        content: ''
        position: absolute
        top: 15%
        left: 55%
        width: 25%
        height: 70%
        background: black

    &:after
        content: ''
        position: absolute
        bottom: -160%
        left: 50%
        transform: translateX(-50%)
        width: 125%
        height: 125%
        background: white
</style>
