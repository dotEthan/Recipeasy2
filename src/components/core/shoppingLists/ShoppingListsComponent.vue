<script setup lang="ts">
// import { ref } from 'vue'
import { useShoppingListStore } from '@/stores/shoppingList'
import ShoppingListComponent from './shoppingList/ShoppingListComponent.vue'
import NewListButtonComponent from './newListButton/NewListButtonComponent.vue'

const shoppingListStore = useShoppingListStore()

const defaultListIndex = 0

function onAddList() {
  shoppingListStore.addNewList()
  console.log('adding list')
}
</script>

<template>
  <div class="shoppinglists-container">
    <div class="row borderize-contain">
      <div class="headline">
        <div class="text-center headline-title">
          <h1>Shopping Lists</h1>
        </div>
      </div>
      <div class="row all-lists-contain">
        <div class="col-xs-12">
          <div class="shopping-lists-contain">
            <div class="viewable-lists">
              <template
                v-for="(shoppingList, i) in shoppingListStore.shoppingLists"
                :key="shoppingList.id"
              >
                <ShoppingListComponent
                  class="sl-list"
                  :class="{ 'sl-default-list': defaultListIndex }"
                  :currentList="shoppingListStore.shoppingLists[i]"
                  :currentListIndex="i"
                />
              </template>
              <NewListButtonComponent class="sl-list" @add-new-list="onAddList()" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="sass">
@import "../../../assets/variables"

.shoppinglists-container
  width: 100%

.headline
    display: flex
    position: relative

.headline-title
    width: 100%


.all-lists-contain
    margin-right: 0
    margin-left: 0

.shopping-lists-contain
    display: flex
    flex-wrap: wrap
    width: 90%
    margin: 0 auto
    justify-content: flex-start
    padding: 0 25px
    overflow: hidden

.sl-list
    width: 100%
    margin: 0 5px
    max-width: 250px

    @media (min-width: 768px)
        width: 50%

    @media (min-width: 1024px)
        flex-grow: 1

.viewable-lists
    display: flex
    flex-wrap: wrap
    justify-content: space-around
    width: 100%

.full-shopping-lists
    display: flex
    flex-wrap: wrap
    width: 100%
    justify-content: space-around
    margin-top: 50px

.full-shopping-list
    width: 48%
    margin: 0 1%

    @media (min-width: 450px)
        width: 30%
        margin: 0 1%

    @media (min-width: 800px)
        width: 17%
        margin: 0 1%

.sl-button-contain
    margin-bottom: 15px
    width: 100%

.sl-button
    background: $colorLightest
    border: 2px solid $colorLighter
    padding: 25px 5%
    height: 75px
    width: 100%

    &:hover
        border: 2px solid $colorDarker

    &:disabled
        color: #cccccc

        &:hover
            border: 2px solid $colorLighter

.sl-button-isdefault
    font-size: .6em
</style>
