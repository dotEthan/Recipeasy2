<script setup lang="ts">
/**
 * Component used to display each recipe direction
 * @example
 *  <DirectionItemComponent
      v-for="(ingredient, index) of selectedRecipe?.ingredients"
      :key="index"
      :itemObject="directions"
    />
 */
import type { PropType } from "vue";

import type { Direction, Ingredient } from "@/types/Recipes";

const props = defineProps({
  itemObject: Object as PropType<Ingredient | Direction>,
  itemType: String
});

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
</script>

<template>
  <div class="w-full mb-4 mt-4">
    <div class="font-bold mb-3">{{ itemObject?.title }}</div>
    <ol>
      <li class="list-outside mb-4" v-for="(item, index) of steps" :key="index">
        {{ item }}
      </li>
    </ol>
  </div>
</template>

<style lang="sass" scoped>
ol
  list-style: none
  counter-reset: item

li
  counter-increment: item

li::before
  content: counter(item)
  display: inline-grid
  place-items: center
  width: 30px
  height: 30px
  border-radius: 100%
  background-color: var(--color-accent)
  margin-right: 10px
  color: var(--color-dark-navy)
  font-family: roboto, sans-serif
  font-size: 17px
</style>
