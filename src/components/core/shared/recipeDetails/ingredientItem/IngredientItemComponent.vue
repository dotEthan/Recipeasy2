<script setup lang="ts">
/**
 * Component used to display each recipe ingredient or directoin in recipe details
 * @todo split for ingredient and details? 
 * @example
 *  <ListItemComponent
      v-for="(ingredient, index) of selectedRecipe?.ingredients"
      :key="index"
      :itemObject="ingredient"
      itemType="ingredient"
    />
 */
import type { PropType } from "vue";

import { useShoppingListStore } from "@/stores/shoppingListStore";
import type { Direction, Ingredient } from "@/types/Recipes";

const props = defineProps({
  itemObject: Object as PropType<Ingredient | Direction>,
  itemType: String
});
const shoppingListStore = useShoppingListStore();

const steps = props.itemObject?.steps?.map((step) => {
  if (step === undefined) return;

  if (typeof step === "string") {
    return step;
  } else {
    const amount = step.amount ?? "";
    const unit = step.unit ?? "";
    const name = step.name ?? "";

    return [amount, unit, name].filter(Boolean).join(" ").trim();
  }
});

function onAddIngredientToList(item: string | undefined) {
  if (typeof item === "undefined") return;
  shoppingListStore.addToDefaultList([item]);
}
</script>

<template>
  <div class="w-full md:w-[calc(50%-2rem)] bg-surface text-primary p-4 mt-4 mb-4 md:m-4 rounded-lg">
    <div class="item-contain">
      <div class="item-list-title font-bold mb-3 underline decoration-accent">
        {{ itemObject?.title }}
      </div>
      <ul class="items-list">
        <li class="list-disc list-inside" v-for="(item, index) of steps" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="sass" scoped>

li::marker
  color: var(--color-accent)
  font-size: 18px
</style>
