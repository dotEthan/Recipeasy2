<script setup lang="ts">
/**
 * Component to display the header for each shopping list
 * @todo Multiple edits at the same time? Turn off one for the next.
 * @example
 *  <ShoppingListHeaderComponent
      :currentList="currentList"
      :currentListIndex="currentListIndex"
      @update:title="currentList.title = $event"
    />
 */
import { type PropType, computed, defineEmits, defineProps, nextTick, ref } from "vue";

import { useShoppingListStore } from "@/stores/shoppingListStore";
import type { ShoppingList } from "@/types/ShoppingLists.d";

const props = defineProps({
  currentList: {
    type: Object as PropType<ShoppingList>,
    default: () => null
  },
  currentListIndex: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(["update:title"]);
const shoppingListStore = useShoppingListStore();

const title = computed({
  get() {
    return props.currentList.title;
  },
  set(newTitle) {
    emit("update:title", newTitle);
  }
});

const titleInputRef = ref<HTMLInputElement | null>(null);

const isEditingTitle = ref(false);

const onEditTitle = async () => {
  isEditingTitle.value = true;
  shoppingListStore.setEditingListIndex(props.currentListIndex);
  shoppingListStore.setEditingItemIndex(-6);
  await nextTick();
  if (titleInputRef.value) {
    titleInputRef.value.focus();
  }
};

const onSaveTitle = () => {
  isEditingTitle.value = false;
  if (!title.value) title.value = "Sample Title";
  shoppingListStore.setEditingListIndex(-1);
  shoppingListStore.setEditingItemIndex(-1);
};
</script>

<template>
  <div class="sl-full-header">
    <div class="sl-type-title">
      <input
        type="text"
        ref="titleInputRef"
        class="ingredient-inplace"
        v-model="title"
        @blur="onSaveTitle()"
        @click="onEditTitle()"
        v-if="isEditingTitle"
      />
      <div class="sl-type-title" @click="onEditTitle()" v-else>
        {{ currentList?.title }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@use '@/assets/variables' as *

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
  font-family: 'Limelight', sans-serif

.ingredient-inplace
  width: 90%
</style>
