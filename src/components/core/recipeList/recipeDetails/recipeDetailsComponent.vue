<script setup lang="ts">
import { useRecipeStore } from '@/stores/recipe'
import ListItemComponent from './listItem/ListItemComponent.vue'
import { useShoppingListStore } from '@/stores/shoppingList'

const recipeStore = useRecipeStore()
const shoppingListStore = useShoppingListStore()
const emit = defineEmits(['closeRecipeDetails', 'removedRecipe', 'editSelectedRecipe'])

const selectedRecipe = recipeStore.getSelectedRecipe

function onClose() {
  emit('closeRecipeDetails')
}

function onAddToShoppingList() {
  const items = selectedRecipe?.ingredients.reduce((acc, ingredient) => {
    if (!Array.isArray(ingredient.steps)) {
      console.warn(`Ingredient ${ingredient.title || 'unknown'} has no valid steps`)
      return acc
    }

    ingredient.steps.forEach((step) => {
      const parts = [step.amount, step.unit, step.name].filter(Boolean)
      acc.push(parts.join(' '))
    })

    return acc
  }, [] as string[])
  if (items) shoppingListStore.addToDefaultList(items)
  console.log('adding')
}

function onEditRecipe() {
  emit('editSelectedRecipe')
  console.log('editing')
}

function onDeleteRecipe() {
  console.log('removing')
  recipeStore.removeSelectedRecipe()
  recipeStore.setSelectedRecipeId('-1')
  emit('closeRecipeDetails')
  // emit('removedRecipe')
}
</script>

<template>
  <div class="overlay-shadow" @click="onClose()"></div>
  <div class="recipe-overlay" appCloseWindow>
    <button type="button" class="recipe-close" aria-label="Close" @click="onClose()">
      <span aria-hidden="true">&times;</span>
    </button>
    <div class="overlay-contain">
      <div class="recipe-overlay-content">
        <div class="recipe-header">
          <div class="recipe-image-contain">
            <img :src="selectedRecipe?.imgPath" class="recipe-image-bg" />
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
            <button class="manage-btn-1" @click="onAddToShoppingList()">
              <i class="add-to-list"></i>
              <div>
                Add all <span class="green-word">Ingredients</span>
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
      </div>
    </div>
  </div>
</template>

<style lang="sass">
@import '@/assets/variables.sass'
h5
    margin: 0
    font-size: 1.5em

.recipe-close
    position: absolute
    top: -10px
    right: -10px
    width: 35px
    height: 35px
    box-shadow: 0 1px 3px 1px #ccc
    background-color: #eef
    z-index: 99
    border-radius: 50%
    border: 2px solid salmon
    font-size: 2rem
    text-align: center

    &:hover
        background-color: #ccc

.recipe-header
    display: flex
    flex-direction: row
    width: 100%
    min-height: 100px

    @media (min-width: 768px)
        min-height: 200px
        // height: auto

.recipe-image-contain
    width: 33%
    height: 100%

.recipe-image-bg
    width: 100%
    height: 100%
    object-fit: cover
    object-position: center
    border-radius: 5px
    max-height: 100px

    @media (min-width: 768px)
        max-height: 200px
        border-radius: 10px

.recipe-detail-title
    padding: 5px 0px 5px 10px
    width: 66%
    color: $recipe-text-color
    height: 100%

    @media (min-width: 768px)
        max-width: 66%
        padding: 15px 0px 15px 15px

.recipe-name
    height: auto
    margin-bottom: 10px

    h4
        font-size: 1.1rem
        font-family: pacifico, sans-serif
        margin: 0

    @media (min-width: 768px)
        height: 55px
        margin: 0 10px 10px

        h4
            font-size: 2.2rem

.recipe-overlay-content
    width: 100%
    height: 100%
    position: relative

.recipe-manage-row
    width: 100%
    height: 10%

.recipe-description-title
    margin: 0 5px 5px

    @media (min-width: 768px)
        margin: 0 10px 10px

.recipe-description-text
    font-size: 1em
    padding: 0 10px

    @media (min-width: 768px)
        padding: 0 20px

.recipe-manage-buttons
    padding: 5px 0
    display: flex
    justify-content: space-around

    @media (min-width: 768px)
        padding: 20px 0

    button
        padding: 3px 5px
        border: none
        background: transparent
        font-weight: 600
        font-size: 1em
        width: 33%
        display: flex
        align-items: center
        justify-content: center
        color: $recipe-text-color
        cursor: pointer

        .add-to-list, .edit-recipe, .delete-recipe
            background-repeat: no-repeat
            background-size: contain
            background-position: center
            width: 40px
            height: 40px
            position: relative

        .add-to-list
            background-image: url('/assets/addlist.png')

            &:after
                content: '+'
                position: absolute
                display: flex
                justify-content: center
                align-items: center
                color: #1EB136
                font-size: 2em
                font-style: normal
                top: 50%
                left: 50%
                transform: translate(-30%, -10%) scale(1)
                background: #eeeeff
                border: 2px solid #1EB136
                width: 18px
                height: 18px
                border-radius: 50%
                transition: all .3s ease-in-out

                @media (min-width: 768px)
                    top: 50%
                    width: 22px
                    height: 22px
                    transform: translate(-50%, -50%) scale(0)

        .edit-recipe
            width: 5px
            height: 15px
            background: #CEAF0A
            margin-right: 10px
            transform: rotate(45deg)
            position: relative
            transition: all .3s ease-in-out

            @media (min-width: 768px)
                width: 7px
                height: 20px
                background: #eef
                margin-right: 20px

            &:before
                content: ''
                position: absolute
                top: -6px
                left: 0
                width: 5px
                height: 5px
                background: #eeeeff
                border-radius: 4px 4px 0 0

                @media (min-width: 768px)
                    width: 7px

            &:after
                content: ''
                position: absolute
                bottom: -6px
                left: 0
                width: 0
                height: 0
                border-left: 3px solid transparent
                border-right: 3px solid transparent
                border-top: 5px solid #eef

                @media (min-width: 768px)
                    border-top: 6px solid #eef
                    bottom: -7px

        .delete-recipe
            width: 25px
            height: 25px
            margin-right: 5px
            transition: all .3s ease-in-out

            @media (min-width: 768px)
                margin-right: 10px

            &:before, &:after
                content: ''
                background: #A41C1C
                width: 15px
                height: 3px
                position: absolute
                top: 50%
                left: 50%
                transition: all .3s ease-in-out

                @media (min-width: 768px)
                    width: 25px
                    height: 5px
                    background: #eeeeff

            &:before
                transform: translate(-50%, -50%) rotate(45deg)

            &:after
                transform: translate(-50%, -50%) rotate(-45deg)

        .green-word
            color: #1EB136

        .red-word
            color: #A41C1C

        .yellow-word
            color: #CEAF0A

        .green-word, .red-word, .yellow-word
            transition: all .3s ease-in-out

            @media (min-width: 768px)
                color: $recipe-text-color

        @media (min-width: 768px)
            &:hover

                .green-word, .yellow-word, .red-word
                    font-weight: 700

                .green-word
                    color: #1EB136

                .red-word
                    color: #A41C1C


                .yellow-word
                    color: #CEAF0A

                .add-to-list:after
                    transform: translate(-50%, -50%) scale(1)

                .edit-recipe
                    background: #CEAF0A
                    transform: rotate(25deg)

                .delete-recipe
                    transform: rotate(180deg) scale(1.2)

                    &:before, &:after
                        background: #A41C1C


.ingredients-contain, .directions-contain
    width: 100%
    color: $recipe-text-color
    padding: 0 5px
    margin-bottom: 15px
    overflow-y: auto
    height: 30%

    @media (min-width: 768px)
        padding: 0 25px

.help-text
    font-size: .8em

.type-section-title
    margin-bottom: 10px
    font-size: 1.4em

.directions-text, .ingredients-text
    padding: 0 5px

    @media (min-width: 768px)
        padding: 0 10px
</style>
