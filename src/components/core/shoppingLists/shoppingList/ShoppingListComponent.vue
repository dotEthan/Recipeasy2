<script setup lang="ts">
import { useShoppingListStore } from '@/stores/shoppingList'
import ShoppingListItemComponent from './shoppingListItem/ShoppingListItemComponent.vue'

const shoppingListStore = useShoppingListStore()

const props = defineProps({ viewableListIndex: String })

const allShoppingLists = shoppingListStore.getAllShoppingLists
// const allShoppingLists = ref()
// console.log(allShoppingLists)
console.log('index: ', props?.viewableListIndex)
const currentShoppingList = allShoppingLists.value.filter(
  (list) => list.id === props.viewableListIndex
)[0]
const currentItems = currentShoppingList.items || []

let editingListIndex = '1'
let editingIngredientIndex = '1'
let defaultListIndex = '1'
// let currentShoppingList = { title: 'fud', items: ['potate'] }
// console.log(currentShoppingList)
function onAddItem() {
  console.log('add item')
}

function onDeleteItem(index: number) {
  console.log('delete item')
}

function onDeleteList() {
  console.log('delete list')
}

function onSaveList() {
  console.log('save')
}

function onEditList() {
  console.log('edit')
}

function onViewableListClose() {
  console.log('close')
}

function onMakeDefault() {
  console.log('make default')
}
</script>

<template>
  <div class="sl-each-contain">
    <div class="sl-full-space">
      <div class="sl-contain">
        <div
          class="sl-main"
          v-if="editingListIndex !== viewableListIndex || editingIngredientIndex !== ''"
        >
          <div class="sl-full-header">
            <div class="sl-type-title">
              {{ currentShoppingList.title }}
            </div>
          </div>
          <ul class="sl-ingredient-list">
            <li
              class="sl-ingredient-list-item"
              v-for="(item, i) of currentShoppingList.items"
              v-bind:key="i"
            >
              <ShoppingListItemComponent
                v-model="currentItems[i]"
                :class="
                  editingListIndex === viewableListIndex && editingIngredientIndex === String(i)
                    ? 'sl-ingredient-input'
                    : 'sl-ingredient-input-hidden'
                "
              />
              <!-- <app-ingredient-input
                v-model="currentItems[i]"
                :class="
                  editingListIndex === viewableListIndex && editingIngredientIndex === String(i)
                    ? 'sl-ingredient-input'
                    : 'sl-ingredient-input-hidden'
                "
                (savedIngredient)="onSingleIngredientSave($event)"
              >
              </app-ingredient-input> -->
              <div
                :class="
                  editingListIndex !== viewableListIndex || editingIngredientIndex !== String(i)
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
                v-for="(ingredient, p) of currentShoppingList.items"
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
        <div class="sl-footer">
          <div class="list-edit-default" @click="onMakeDefault()">
            <div
              class="default-circle"
              :class="{
                on: defaultListIndex === viewableListIndex
              }"
            ></div>
            Default
          </div>
          <div v-if="editingListIndex === viewableListIndex && editingIngredientIndex !== ''">
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
            <div class="list-edit" @click="onViewableListClose()">Hide</div>
            <div class="list-edit" @click="onDeleteList()">Delete</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
@import "../../../../assets/variables"

.sl-each-contain
    display: flex
    height: 100%

.sl-full-space
    width: 100%

.sl-contain
    width: 100%
    height: 100%
    // border-radius: 5px
    min-height: 200px
    display: flex
    flex-direction: column
    justify-content: space-between
    overflow: hidden
    min-height: 40vh
    max-height: 50vh

.sl-main
    height: 100%
    min-height: 30vh

.sl-full-header
    display: flex
    align-items: center
    justify-content: center
    min-height: 40px
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
    height: 100%
    overflow-y: scroll
    border-left: 1px solid #cccccc
    border-right: 1px solid #cccccc
    flex-grow: 1
    margin-bottom: 0
    list-style-type: none

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
