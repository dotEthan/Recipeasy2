<script setup lang="ts">
/**
 * Component to display recipe details for public recipes
 * @todo DRY this and Welcome's publicRecipeDetailsComponent. componentize shared pieces. 
 * @example
 *  <PublicRecipeDetailsComponent
      v-if="recipeStore.selectedRecipeId"
      @closeRecipeDetails="closeRecipeDetails()"
    />
 */
import { useRecipeStore } from "@/stores/recipeStore";

import ListItemComponent from "../../recipeList/recipeDetails/listItem/ListItemComponent.vue";
import NoteItemComponent from "../../recipeList/recipeDetails/noteItem/NoteItemComponent.vue";
import RecipeDetailHeaderComponent from "../../recipeList/recipeDetails/recipeDetailHeader/RecipeDetailHeaderComponent.vue";
import RecipeManageButtonsComponent from "../../recipeList/recipeDetails/recipeManageButtons/RecipeManageButtonsComponent.vue";
import TagItemComponent from "../../recipeList/recipeDetails/tag-item/TagItemComponent.vue";
import XToCloseComponent from "../../shared/xToClose/XToCloseComponent.vue";

const emit = defineEmits(["closeRecipeDetails", "removedRecipe", "editSelectedRecipe"]);
const recipeStore = useRecipeStore();
const selectedRecipe = recipeStore.selectedRecipe;
function onClose() {
  emit("closeRecipeDetails");
}
</script>

<template>
  <div class="recipe-detail-container">
    <div class="overlay-shadow" @click="onClose()"></div>
    <div class="recipe-overlay">
      <XToCloseComponent @close="onClose" />
      <div class="overlay-contain">
        <div class="recipe-overlay-content">
          <RecipeDetailHeaderComponent :selectedRecipe="selectedRecipe" />
          <RecipeManageButtonsComponent :can-edit="false" :can-delete="false" />
          <div class="ingredients-contain">
            <div class="type-section-title" v-if="selectedRecipe?.ingredients">
              INGREDIENTS: <span class="help-text">(click to add ingredient to shopping list)</span>
            </div>
            <div v-else class="type-section-title">No Ingredients</div>
            <ListItemComponent
              v-for="(ingredient, index) of selectedRecipe?.ingredients"
              :key="index"
              :itemObject="ingredient"
              itemType="ingredient"
            />
          </div>
          <div class="ingredients-contain">
            <div class="type-section-title" v-if="selectedRecipe?.directions">DIRECTIONS:</div>
            <div class="type-section-title" v-else>No Directions</div>
            <ListItemComponent
              v-for="(direction, index) of selectedRecipe?.directions"
              v-bind:key="index"
              :itemObject="direction"
              itemType="direction"
            />
          </div>
          <div class="ingredients-contain">
            <div class="type-section-title">Tags:</div>
            <div class="tags-wrapper" v-if="selectedRecipe?.tags">
              <TagItemComponent
                v-for="(tag, index) of selectedRecipe?.tags"
                v-bind:key="index"
                :tag="tag"
              />
            </div>
            <div class="type-section-none" v-else>No tags</div>
          </div>
          <div class="ingredients-contain">
            <div class="type-section-title">Notes:</div>
            <div class="notes-wrapper" v-if="selectedRecipe?.notes">
              <NoteItemComponent
                v-for="(note, index) of selectedRecipe?.notes"
                v-bind:key="index"
                :note="note"
              />
            </div>
            <div class="type-section-none" v-else>No Notes</div>
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

.recipe-overlay-content
    width: 100%
    height: 100%
    position: relative

.ingredients-contain, .directions-contain
    width: 100%
    color: $recipe-text-color
    padding: 0 5px
    margin-bottom: 15px

    @media (min-width: 768px)
        padding: 0 25px

.help-text
    font-size: .8em

.type-section-title
    margin-bottom: 10px
    font-size: 1.4em

.type-section-none
    margin-bottom: 10px
    font-size: 1em

.directions-text, .ingredients-text
    padding: 0 5px

    @media (min-width: 768px)
        padding: 0 10px

.tags-wrapper
  display: flex
  flex-direction: row
  flex-wrap: wrap
</style>
