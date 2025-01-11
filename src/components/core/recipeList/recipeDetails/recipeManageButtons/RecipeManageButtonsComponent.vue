<script setup lang="ts">
import { useRecipeStore } from '@/stores/recipe'
import { useShoppingListStore } from '@/stores/shoppingList'


const emit = defineEmits(['closeRecipeDetails', 'removedRecipe'])

const recipeStore = useRecipeStore()
const shoppingListStore = useShoppingListStore()

const selectedRecipe = recipeStore.getSelectedRecipe
const isSelectedRecipePublic = recipeStore.isSelectedRecipePublic

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
    recipeStore.setEditStatusSelectedId(true)   
    console.log('editing')
}

function onDeleteRecipe() {
  console.log('removing')
  recipeStore.removeSelectedRecipe()
  recipeStore.setSelectedRecipeId('')
  emit('removedRecipe')
}

function addPublicRecipeToPersonal() {
    console.log('adding to users')
}
</script>

<template>
<div class="recipe-manage-row">
    <div class="recipe-manage-buttons">
    <button class="manage-btn-1" @click="onAddToShoppingList()">
        <i class="add-to-list"></i>
        <div>
        Add to Shopping List
        </div>
    </button>
    <button v-if="!isSelectedRecipePublic" class="manage-btn-2" @click="onEditRecipe">
        <div class="edit-recipe"></div>
        <span class="yellow-word">Edit</span>&nbsp;Recipe
    </button>
    <button v-else class="cannot-manage">
        <span class="">Public Recipes</span>
        <span class="">Cannot Edit</span>
    </button>
    <button v-if="!isSelectedRecipePublic" class="manage-btn-3" @click="onDeleteRecipe">
        <div class="delete-recipe"></div>
        <span class="red-word">Delete</span>&nbsp;Recipe
    </button>
    <button v-else class="manage-btn-3" @click="addPublicRecipeToPersonal">
        <div class="delete-recipe"></div>
        <span class="red-word" >Add To Your</span>&nbsp;Recipes
    </button>
    </div>
</div>
</template>

<style lang="sass" scoped>
@import '@/assets/variables.sass'

.recipe-manage-row
    width: 100%
    // height: 10%

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
        // font-weight: 300
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

            //the big +
            &:after
                content: '+'
                position: absolute
                display: flex
                justify-content: center
                align-items: center
                color: #1EB136
                // font-size: 2em
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

.cannot-manage
    display: flex
    flex-direction: column

</style>