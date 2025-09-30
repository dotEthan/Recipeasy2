<script setup lang="ts">
/**
 * Component used when user clicks recipe image to see full recipe details
 * @todo DRY this and Welcome's publicRecipeDetailsComponent. componentize shared pieces.
 * @todo Ensure when user deletes recipe the image is also deleted if it's private, or if public, add to Chron job when recipe HARD deleted, image is too
 * @example
 *  <RecipeDetailsComponent
      :selected-recipe="selectedRecipe"
      @closeRecipeDetails="closeRecipeDetails"
      @edit-selected-recipe="recipeStore.setEditStatusSelectedId(true)"
    />
 */
import { ReceiptText, Utensils } from "lucide-vue-next";

import { useRecipeStore } from "@/stores/recipeStore";

import NoteItemComponent from "../../shared/recipeDetails/noteItem/NoteItemComponent.vue";
import RecipeDetailHeaderComponent from "../../shared/recipeDetails/recipeDetailHeader/RecipeDetailHeaderComponent.vue";
import TagItemComponent from "../../shared/recipeDetails/tag-item/TagItemComponent.vue";
import XToCloseComponent from "../../shared/xToClose/XToCloseComponent.vue";
import DirectionItemComponent from "./directionItem/DirectionItemComponent.vue";
import IngredientItemComponent from "./ingredientItem/IngredientItemComponent.vue";
import RecipeManageButtonsComponent from "./recipeManageButtons/personalRecipeManageButtons/PersonalRecipeManageButtonsComponent.vue";
import PublicRecipeManageButtonsComponent from "./recipeManageButtons/publicRecipeManageButtons/PublicRecipeManageButtonsComponent.vue";

defineProps({
  isPublic: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["closeRecipeDetails", "removedRecipe", "editSelectedRecipe"]);
const recipeStore = useRecipeStore();
const selectedRecipe = recipeStore.selectedRecipe;
function onClose() {
  emit("closeRecipeDetails");
}
</script>

<template>
  <div
    class="absolute top-0 left-0 w-full h-dvh flex justify-center items-center bg-black/40 z-30"
    @click="onClose()">
    <div
      class="relative w-[90vw] h-[90dvh] flex justify-center lg:w-[60vw] bg-primary rounded-xl shadow-lg overflow-hidden"
      @click.stop>
      <XToCloseComponent :position="['top', 'right']" @close="onClose" />
      <div class="relative w-full h-full flex flex-col">
        <RecipeDetailHeaderComponent :selectedRecipe="selectedRecipe" />
        <PublicRecipeManageButtonsComponent v-if="isPublic" />
        <RecipeManageButtonsComponent v-if="!isPublic" />
        <div class="flex-1 overflow-y-auto p-8">
          <div class="w-full mb-10">
            <div class="flex flex-row font-bold mb-2 text-lg" v-if="selectedRecipe?.ingredients">
              <Utensils :size="30" class="text-accent mr-2" /> Ingredients:
            </div>
            <div v-else class="mb-2 text-base">No Ingredients</div>
            <div class="flex flex-row flex-wrap">
              <IngredientItemComponent
                v-for="(ingredient, index) of selectedRecipe?.ingredients"
                :key="index"
                :itemObject="ingredient"
                itemType="ingredient" />
            </div>
          </div>
          <div class="w-full mb-10">
            <div class="flex flex-row font-bold mb-2 text-lg" v-if="selectedRecipe?.directions">
              <ReceiptText :size="30" class="text-accent mr-2" />
              Directions:
            </div>
            <div class="flex flex-row font-bold mb-2 text-base" v-else>No Directions</div>

            <div class="flex flex-col">
              <DirectionItemComponent
                v-for="(direction, index) of selectedRecipe?.directions"
                v-bind:key="index"
                :itemObject="direction"
                itemType="direction" />
            </div>
          </div>
          <div class="w-full mb-10">
            <div class="flex flex-row font-bold mb-2 text-lg">Notes:</div>
            <div class="notes-wrapper" v-if="selectedRecipe?.notes">
              <NoteItemComponent
                v-for="(note, index) of selectedRecipe?.notes"
                v-bind:key="index"
                :note="note" />
            </div>
            <div class="mb-2 text-base" v-else>No Notes</div>
          </div>
          <div class="w-full">
            <div class="flex flex-row font-bold mb-2 text-lg">Tags:</div>
            <div class="tags-wrapper" v-if="selectedRecipe?.tags">
              <TagItemComponent
                v-for="(tag, index) of selectedRecipe?.tags"
                v-bind:key="index"
                :tag="tag" />
            </div>
            <div class="mb-2 text-base" v-else>No tags</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *
.recipe-detail-container
  position: absolute
  top: 0
  left: 0
  width: 100%
  display: flex
  justify-content: center
  align-items: center
  height: calc(100vh - $navbar-height)

.recipe-detail-title
  padding: 5px 0px 5px 10px
  width: 66%
  color: $recipe-text-color
  height: 100%

  @media (min-width: 768px)
    max-width: 66%
    padding: 15px 0px 15px 15px

.help-text
    font-size: .8em


.directions-text, .ingredients-text
    padding: 0 5px

    @media (min-width: 768px)
        padding: 0 10px

.tags-wrapper
  display: flex
  flex-direction: row
  flex-wrap: wrap
</style>
