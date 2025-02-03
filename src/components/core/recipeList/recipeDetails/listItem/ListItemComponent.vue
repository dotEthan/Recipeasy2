<script setup lang="ts">
import type { PropType } from 'vue'
import type { Direction, Ingredient } from '@/types/Recipes'
import { useShoppingListStore } from '@/stores/shoppingList'

const props = defineProps({
  itemObject: Object as PropType<Ingredient | Direction>,
  itemType: String
})
const shoppingListStore = useShoppingListStore();
console.log(props.itemType === 'ingredient')

const steps = props.itemObject?.steps?.map((step) => {
  if (step === undefined) return

  if (typeof step === 'string') {
    return step
  } else {
    const amount = step.amount ?? ''
    const unit = step.unit ?? ''
    const name = step.name ?? ''

    return [amount, unit, name].filter(Boolean).join(' ').trim()
  }
})

function onAddIngredientToList(item: string | undefined) {
  console.log('add ingredient: ', item)
  if (typeof item === 'undefined') return
  shoppingListStore.addToDefaultList([item])
}
</script>

<template>
  <div class="item-list">
    <div class="item-contain">
      <div class="item-list-title">{{ itemObject?.title }}</div>
      <ul class="items-list">
        <li
          :class="itemType === 'ingredient' ? 'ingredient-contain' : 'direction-contain'"
          v-for="(item, index) of steps"
          :key="index"
        >
          <div
            :class="itemType === 'ingredient' ? 'text ingredient-text' : 'text direction-text'"
            @click="
              () => {
                if (itemType === 'ingredient') onAddIngredientToList(item)
              }
            "
          >
            - {{ item }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="sass" scoped>

.ingredient-contain, .direction-contain
  list-style-type: none

.directions-text, .ingredients-text
    padding: 0 5px

    @media (min-width: 768px)
        padding: 0 10px

.direction-text
  margin-bottom: 10px
</style>
