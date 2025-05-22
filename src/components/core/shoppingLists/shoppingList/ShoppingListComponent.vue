<script setup lang="ts">
/**
 * Component to display individual Shopping Lists
 * @todo Click item to edit, or cross off?
 * @example
 *  <ShoppingListComponent
      v-for="(shoppingList, i) in shoppingListStore.shoppingLists"
      :key="shoppingList.id"
      :currentList="shoppingListStore.shoppingLists[i]"
      :currentListIndex="i"
    />
 */
import { computed, ref } from "vue";
import type { PropType } from "vue";

import { useShoppingListStore } from "@/stores/shoppingListStore";
import type { ShoppingList } from "@/types/ShoppingLists.d";

import ShoppingListEditItemComponent from "./shoppingListEditItemComponent/ShoppingListEditItemComponent.vue";
import ShoppingListFooterComponent from "./shoppingListFooter/ShoppingListFooterComponent.vue";
import ShoppingListHeaderComponent from "./shoppingListHeader/ShoppingListHeaderComponent.vue";
import ShoppingListItemComponent from "./shoppingListItem/ShoppingListItemComponent.vue";

const shoppingListStore = useShoppingListStore();

const props = defineProps({
  currentList: Object as PropType<ShoppingList>,
  currentListIndex: {
    type: Number,
    default: -1
  }
});

const dummyData = {
  id: "",
  items: [],
  isDefault: false,
  isOpen: true,
  creator: "",
  viewableBy: [""]
};

let currentList = props.currentList || (dummyData as ShoppingList);

let currentListItems = currentList?.items;
let isMinimized = ref(false);
let editingListIndex = computed(() => shoppingListStore.editingListIndex);
let editingItemIndex = computed(() => shoppingListStore.editingItemIndex);
const defaultList = computed(() => shoppingListStore.defaultList);
const defaultListId = defaultList.value?.id;

const hideOrShow = computed(() => (!currentList.isOpen ? "show" : "hide"));

function onAddItem() {
  currentListItems.push("");
  shoppingListStore.setEditingListIndex(props.currentListIndex);
  shoppingListStore.setEditingItemIndex(currentList.items.length - 1);
}

function onDeleteList() {
  shoppingListStore.deleteList(props.currentListIndex);
}

function toggleListCollapse() {
  isMinimized.value = !isMinimized.value;
  currentList.isOpen = !currentList.isOpen;
}

function onMakeDefault() {
  shoppingListStore.setDefaultList(currentList.id);
}
</script>

<template>
  <div class="sl-each-contain">
    <div class="sl-contain">
      <ShoppingListHeaderComponent
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
    <ShoppingListFooterComponent
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
@use '@/assets/variables' as *

.sl-each-contain
  display: flex
  flex-direction: column
  width: 250px

.sl-contain
  width: 100%
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
  font-family: 'Limelight', sans-serif

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
    flex-grow: 0

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

.add-new-text
  font-size: 1.7em
  margin: 10px 0
  font-weight: 500
</style>
