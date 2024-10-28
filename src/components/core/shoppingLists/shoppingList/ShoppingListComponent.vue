<script setup lang="ts">
import { ref, computed } from 'vue'
import { useShoppingListStore } from '@/stores/shoppingList'
import ShoppingListItemComponent from './shoppingListItem/ShoppingListItemComponent.vue'
import NewListButtonComponent from '../newListButton/NewListButtonComponent.vue'

const shoppingListStore = useShoppingListStore()

const props = defineProps({
  viewableListIndex: {
    type: Number,
    default: -1
  }
})

const dummyData = { id: '', items: [], isDefault: false }

const allShoppingLists = shoppingListStore.getAllLists
console.log('props: ', props.viewableListIndex)
console.log('ids: ', shoppingListStore.viewableShoppingListIds)

const listId = shoppingListStore.viewableShoppingListIds[props?.viewableListIndex]
console.log('listId: ', listId)
console.log('all lists: ', allShoppingLists.value)
let currentList = allShoppingLists.value.filter((list) => list.id === listId)[0] || dummyData

let currentListItems = currentList?.items
let defaultListId = shoppingListStore.getDefaultId
let isMinimized = ref(false)
const hideOrShow = computed(() => (currentList.isShowing ? 'show' : 'hide'))
let editingListIndex = 1
let editingItemIndex = -1

function onAddItem() {
  currentListItems.push('')
  editingItemIndex = currentListItems.length
}

function onAddList() {
  // shoppingListStore.
  console.log('adding list')
  // console.log('length', allShoppingLists.value.length - 1)
  // console.log('cirrent', allShoppingLists.value[allShoppingLists.value.length - 1])
  // currentList = allShoppingLists.value[allShoppingLists.value.length - 1] as ShoppingList
}

function onDeleteItem(itemIndex: number) {
  currentListItems.splice(itemIndex, 1)
}

function onDeleteList(index: number) {
  shoppingListStore.deleteList(index)
}

function onSaveList() {
  // editingListIndex = -1
  console.log('save')
}

function onEditList() {
  console.log('edit')
}

function toggleListCollapse() {
  isMinimized.value = !isMinimized.value
  currentList.isShowing = !currentList.isShowing
  console.log('close')
}

function onMakeDefault() {
  shoppingListStore.setDefaultList(currentList.id)
}
</script>

<template>
  <div class="sl-each-contain" v-if="currentList.id">
    <div class="sl-full-space">
      <div class="sl-contain">
        <div
          class="sl-main"
          v-if="editingListIndex !== viewableListIndex || editingItemIndex !== -1"
        >
          <div class="sl-full-header">
            <div class="sl-type-title">
              {{ currentList.title }}
            </div>
          </div>
          <ul class="sl-ingredient-list" :class="{ minimize: isMinimized }">
            <li
              class="sl-ingredient-list-item"
              v-for="(item, i) of currentList.items"
              v-bind:key="i"
            >
              <ShoppingListItemComponent
                v-model="currentListItems[i]"
                :class="
                  editingListIndex === viewableListIndex && editingItemIndex === i
                    ? 'sl-ingredient-input'
                    : 'sl-ingredient-input-hidden'
                "
              />
              <!-- <app-ingredient-input
                v-model="currentItems[i]"
                :class="
                  editingListIndex === viewableListIndex && editingIngredientIndex === i
                    ? 'sl-ingredient-input'
                    : 'sl-ingredient-input-hidden'
                "
                (savedIngredient)="onSingleIngredientSave($event)"
              >
              </app-ingredient-input> -->
              <div
                :class="
                  editingListIndex !== viewableListIndex || editingItemIndex !== i
                    ? 'sl-ingredient'
                    : 'sl-ingredient-hidden'
                "
              >
                <div class="sl-ingredient-name">{{ item }}</div>
                <div class="ingredient-delete" @click="onDeleteItem(i)"></div>
              </div>
            </li>
            <li class="sl-list-item">
              <div class="ingredient-add" @click="onAddItem()">+ Add Item</div>
            </li>
          </ul>
          <div class="sl-footer">
            <div class="list-edit-default" @click="onMakeDefault()">
              <div
                class="default-circle"
                :class="{
                  on: defaultListId === listId
                }"
              ></div>
              Default
            </div>
            <div v-if="editingListIndex === viewableListIndex && editingItemIndex !== -1">
              <div class="list-edit">Disabled</div>
            </div>
            <template v-else>
              <div
                class="list-edit"
                v-if="editingListIndex !== viewableListIndex"
                @click="onEditList()"
              >
                Edit
              </div>
              <div class="list-edit" v-else @click="onSaveList()">Save</div>
              <div class="list-edit" @click="toggleListCollapse()">{{ hideOrShow }}</div>
              <div class="list-edit" @click="onDeleteList(viewableListIndex || -1)">Delete</div>
            </template>
          </div>
        </div>
        <div v-else>
          <form class="sl-main" @submit="onSaveList()">
            <div class="sl-full-header">
              <div class="sl-type-title">
                <input type="text" class="title-inplace" id="listTitle" formControlName="title" />
              </div>
            </div>
            <ul class="sl-ingredient-list">
              <li
                class="sl-list-item"
                v-for="(ingredient, p) of currentList.items"
                v-bind:key="p"
                formArrayName="ingredients"
              >
                <div>
                  <input type="text" class="ingredient-inplace" formControlName="name" />
                </div>
                <div class="ingredient-delete" @click="onDeleteItem(p)"></div>
              </li>
              <li class="sl-list-item">
                <div class="ingredient-add" @click="onAddItem()">+ Add Item</div>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </div>
  </div>
  <NewListButtonComponent class="sl-list" v-else @add-new-list="onAddList()" />
</template>

<style lang="sass">
@import "../../../../assets/variables"

.sl-each-contain
    display: flex
    // height: 100%

.sl-full-space
    width: 100%

.sl-contain
    width: 100%
    // height: 100%
    // border-radius: 5px
    min-height: 200px
    display: flex
    flex-direction: column
    justify-content: space-between
    overflow: hidden
    // min-height: 40vh
    // max-height: 50vh

.sl-main
    // height: 100%
    // min-height: 30vh

.sl-full-header
    display: flex
    align-items: center
    justify-content: center
    min-height: 50px
    background: $colorLighter
    color: $colorDarkest
    border-top-right-radius: 2px
    border-top-left-radius: 2px

.sl-type-title
    display: flex
    justify-content: center
    text-align: center
    font-weight: 500
    font-size: 1.3em
    font-family: pacifico, sans-serif

.title-inplace
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

.sl-list-item
    list-style-type: none
    font-size: .9em
    margin-left: 5px
    display: flex
    padding: 5px 0

    &:hover
        text-decoration: underline


.sl-ingredient-list-item
    padding: 5px 0

.sl-ingredient
    display: flex
    justify-content: space-between
    align-items: center

.sl-ingredient-hidden
    display: none

.sl-ingredient-input-hidden
    display: none

.sl-ingredient-name
    width: 100%

.ingredient-delete
    width: 25px
    height: 25px
    position: relative
    cursor: pointer

.ingredient-add
    cursor: pointer
    list-style-type: none


.ingredient-delete

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
    border-bottom-right-radius: 2px
    border-bottom-left-radius: 2px
    border: 1px solid #ccc
    display: flex
    justify-content: center
    align-items: center

    &:hover
        background: #555
        color: $colorLightest

.list-edit-default
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

        .add-new-sl-contain
            border: 2px solid #666

        .add-new-sl-button
            &:before, &:after
                background: #666

.add-new-sl-contain, .add-new-sl-button
    width: 75px
    height: 75px

.add-new-sl-contain
    position: relative
    border: 2px solid #ddd
    border-radius: 50%

.add-new-sl-button
    // position: absolute

    &:before, &:after
        content: ''
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-48%,-48%)
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
