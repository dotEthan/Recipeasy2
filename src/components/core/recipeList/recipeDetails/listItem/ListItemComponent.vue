<script setup lang="ts">
import type { PropType } from 'vue'
import type { Direction, Ingredient } from '@/types/Recipes'

const props = defineProps({
  itemObject: Object as PropType<Ingredient | Direction>
})
console.log(props.itemObject)
</script>

<template>
  <div class="item-list">
    <div class="item-contain">
      <div class="item-list-title">{{ itemObject?.title }}</div>
      <!-- <ul class="items-list">
                <li [className]="itemType === 'ingredient' ? 'ingredient-contain' : 'direction-contain'"
                    *ngFor='let item of items'>
                    <div [className]="itemType === 'ingredient' ? 'text ingredient-text' : 'text direction-text'"
                        (click)="itemType === 'ingredient' ? onAddIngredientToList(item) : null">
                        - {{ item.name }}
                    </div>
                </li>
            </ul> -->
    </div>
  </div>
</template>
