<script setup lang="ts">
import router from '@/router/main'
import { useRecipeStore } from '@/stores/recipe'
import ListItemComponent from './listItem/ListItemComponent.vue'

const recipeStore = useRecipeStore()
const emit = defineEmits(['closeRecipeDetails'])
console.log('here we are: ', recipeStore.getSelectedRecipe)

const selectedRecipe = recipeStore.getSelectedRecipe

function onClose() {
  emit('closeRecipeDetails')
}

function onOverlayShadowClick(e: Event) {
  if (e.target === e.currentTarget) {
    router.push('/recipes')
  }
}

function onAddToShoppingList() {}

function onEditRecipe() {}

function onDeleteRecipe() {}
</script>

<template>
  <div class="overlay-shadow" @click="onOverlayShadowClick($event)">
    <div class="recipe-overlay" appCloseWindow>
      <button type="button" class="recipe-close" aria-label="Close" @click="onClose()">
        <span aria-hidden="true">&times;</span>
      </button>
      <div class="overlay-contain">
        <div class="recipe-overlay-content">
          <div class="recipe-header">
            <div class="recipe-image-contain">
              <img src="" class="recipe-image-bg" />
            </div>
            <div class="recipe-detail-title">
              <div class="recipe-name">
                <h4>{{ selectedRecipe?.name }}</h4>
              </div>
              <div class="recipe-description">
                <h5 class="recipe-description-title">Description:</h5>
                <p class="recipe-description-text">
                  {{ selectedRecipe?.description }}
                </p>
              </div>
            </div>
          </div>
          <div class="recipe-manage-row">
            <div class="recipe-manage-buttons">
              <button class="manage-btn-1" @click="onAddToShoppingList">
                <i class="add-to-list"></i>
                <div>
                  Add <span class="green-word">Ingredients</span>
                  <br />
                  to List
                </div>
              </button>
              <button class="manage-btn-2" @click="onEditRecipe">
                <div class="edit-recipe"></div>
                <span class="yellow-word">Edit</span>&nbsp;Recipe
              </button>
              <button class="manage-btn-3" @click="onDeleteRecipe">
                <div class="delete-recipe"></div>
                <span class="red-word">Delete</span>&nbsp;Recipe
              </button>
            </div>
          </div>
          <div class="ingredients-contain">
            <div class="type-section-title" v-if="selectedRecipe?.ingredients">
              INGREDIENTS: <span class="help-text">(click to add ingredient to shopping list)</span>
            </div>
            <div v-else class="type-section-title">No Ingredients</div>
            <ListItemComponent
              v-for="(ingredient, index) of selectedRecipe?.ingredients"
              v-bind:key="index"
              :itemObject="ingredient"
            />
          </div>
          <div class="ingredients-contain">
            <div class="type-section-title" v-if="selectedRecipe?.directions">DIRECTIONS:</div>
            <div class="type-section-title" v-else>No Directions</div>
            <ListItemComponent
              v-for="(direction, index) of selectedRecipe?.directions"
              v-bind:key="index"
              :itemObject="direction"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
