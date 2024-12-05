<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PropType } from 'vue'
import { useShoppingListStore } from '@/stores/shoppingList'
import ShoppingListItemComponent from './shoppingListItem/ShoppingListItemComponent.vue'
import type { ShoppingList } from '@/types/ShoppingLists'
import ShoppingListEditItemComponent from './shoppingListEditItemComponent/ShoppingListEditItemComponent.vue'
import SlFooter from './slFooter/SlFooterComponent.vue'
import SlHeaderComponent from './slHeader/SlHeaderComponent.vue'

const shoppingListStore = useShoppingListStore()

const props = defineProps({
  currentList: Object as PropType<ShoppingList>,
  currentListIndex: {
    type: Number,
    default: -1
  }
})

console.log('currentList: ', props.currentList)
console.log('currentListIndex: ', props.currentListIndex)

const dummyData = { id: '', items: [], isDefault: false, isOpen: true }

let currentList = props.currentList || (dummyData as ShoppingList)

let currentListItems = currentList?.items
let isMinimized = ref(false)
let editingListIndex = computed(() => shoppingListStore.editingListIndex)
let editingItemIndex = computed(() => shoppingListStore.editingItemIndex)
let defaultListId = computed(() => shoppingListStore.defaultListId)

const hideOrShow = computed(() => (currentList.isOpen ? 'show' : 'hide'))

function onAddItem() {
  currentListItems.push('')
  shoppingListStore.setEditingListIndex(props.currentListIndex)
  shoppingListStore.setEditingItemIndex(currentList.items.length - 1)
}

function onDeleteList() {
  shoppingListStore.deleteList(props.currentListIndex)
}

function toggleListCollapse() {
  isMinimized.value = !isMinimized.value
  currentList.isOpen = !currentList.isOpen
}

function onMakeDefault() {
  shoppingListStore.setDefaultList(currentList.id)
}

//TODO Edit Item when clicked focuses on input
</script>

<template>
  <div class="sl-each-contain">
    <div class="sl-contain">
      <SlHeaderComponent
        :currentList="currentList"
        :currentListIndex="currentListIndex"
        @update:title="currentList.title = $event"
      />
      <ul class="sl-ingredient-list" :class="{ minimize: isMinimized }">
        <li class="sl-ingredient-list-item" v-for="(item, i) in currentList.items" :key="i">
          <ShoppingListEditItemComponent
            v-if="editingListIndex === props.currentListIndex && editingItemIndex === i"
            :itemIndex="i"
            :listIndex="currentListIndex"
          />
          <ShoppingListItemComponent
            v-model="currentListItems[i]"
            class="sl-ingredient-input"
            :item="currentListItems[i]"
            :itemIndex="i"
            :listIndex="currentListIndex"
            v-else
          />
        </li>
        <li class="sl-list-item">
          <div class="ingredient-add" @click="onAddItem()">+ Add Item</div>
        </li>
      </ul>
    </div>
    <SlFooter
      :currentList="currentList"
      :defaultListId="defaultListId"
      :hideOrShow="hideOrShow"
      @makeDefault="onMakeDefault"
      @toggleCollapse="toggleListCollapse"
      @deleteList="onDeleteList"
    />
  </div>
</template>

<style lang="sass" scoped>
@import "../../../../assets/variables"

.sl-each-contain
  display: flex

.sl-contain
  width: 100%
  min-height: 200px
  display: flex
  flex-direction: column
  justify-content: space-between
  overflow: hidden

.sl-header
  display: flex
  align-items: center
  justify-content: center
  min-height: 50px
  background: $colorLighter
  color: $colorDarkest
  border-radius: 2px 2px 0 0

.sl-type-title
  display: flex
  justify-content: center
  text-align: center
  font-weight: 500
  font-size: 1.3em
  font-family: pacifico, sans-serif

.ingredient-inplace
  width: 90%

.sl-ingredient-list
  padding: 10px
  height: 250px
  overflow-y: scroll
  border-left: 1px solid #cccccc
  border-right: 1px solid #cccccc
  flex-grow: 1
  margin: 0
  list-style-type: none

  &.minimize
    padding: 0
    margin: 0
    height: 0

.sl-ingredient-list-item
  padding: 5px 0

.ingredient-add
  cursor: pointer
  list-style-type: none

.sl-footer
  display: flex
  height: 50px

.list-edit, .list-edit-default
  background: $colorLighter
  color: $colorDarkest
  width: 50px
  height: 50px
  text-align: center
  padding: 15px 0
  cursor: pointer
  border-radius: 0 0 2px 2px
  border: 1px solid #ccc
  display: flex
  justify-content: center
  align-items: center

.list-edit-default
  flex-grow: 2

.list-edit-alter
  display: flex
  flex-grow: 1

.default-circle
  border-radius: 50%
  width: 10px
  height: 10px
  background: grey
  margin-right: 10px

  &.on
    background: green

.sl-empty-space
  width: 100%
  height: 100%
  border: 2px solid #cccccc
  border-radius: 5px
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  cursor: pointer

  &:hover
    border: 2px solid #666

.add-new-sl-contain, .add-new-sl-button
  width: 75px
  height: 75px

.add-new-sl-contain
  position: relative
  border: 2px solid #ddd
  border-radius: 50%

.add-new-sl-button
  &:before, &:after
    content: ''
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    background: #bbb

  &:before
    width: 30px
    height: 4px

  &:after
    width: 4px
    height: 30px

.add-new-text
  font-size: 1.7em
  margin: 10px 0
  font-weight: 500
</style>
