<script setup lang="ts">
/**
 * Component to display full Shopping List collection
 * @todo Ensure all Shoppign List functionality working since BackEnd migration
 * @example
 *  <ShoppingListsComponent />
 */
import { useShoppingListStore } from "@/stores/shoppingListStore";

import NewListButtonComponent from "./newListButton/NewListButtonComponent.vue";
import ShoppingListComponent from "./shoppingList/ShoppingListComponent.vue";

const shoppingListStore = useShoppingListStore();
const defaultListIndex = 0;
</script>

<template>
  <section class="shoppinglists-container">
    <div class="headline-contain">
      <h1>Shopping Lists</h1>
    </div>
    <div class="viewable-lists">
      <ShoppingListComponent
        v-for="(shoppingList, i) in shoppingListStore.shoppingLists"
        :key="shoppingList.id"
        :class="{ 'sl-default-list': defaultListIndex }"
        :currentList="shoppingListStore.shoppingLists[i]"
        :currentListIndex="i"
      />
      <NewListButtonComponent />
    </div>
  </section>
</template>
<style lang="sass" scoped>
@use '@/assets/variables' as *

.shoppinglists-container
  width: 100%
  height: 100%
  padding: 10px
  overflow-y: scroll

  @media (min-width: 768px)
    padding: 50px

.headline-contain
  position: relative
  width: 100%
  text-align: center

.viewable-lists
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))
  grid-template-rows: auto
  justify-items: center
  align-items: start
  gap: 10px
  width: 100%

.viewable-lists > .sl-list
  width: 250px

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
