<script setup lang="ts">
import { PropType, ref, watch} from 'vue';
import { SwitchRoot, SwitchThumb } from 'radix-vue'
import type { Recipe } from '@/types/Recipes'
import { useRecipeStore } from '@/stores/recipe';

const props = defineProps({
  selectedRecipe: Object as PropType<Recipe>
})
const recipeStore = useRecipeStore()
const switchState = ref(false)

watch(switchState, (newState) => {
  handleSwitchChange(newState);
});

function handleSwitchChange(newState: boolean) {
  console.log(newState)
  const selectedRecipeId = props.selectedRecipe?.id || ''
  if (newState) {
    recipeStore.addToPublicRecipes(selectedRecipeId)
    // copy image to public image repo in cloudinary
  } else {
    //remove from public recipes
    // remove image from public image repo in cloudinary
  }
}
</script>

<template>
    <div class="recipe-header">
          <div class="recipe-image-contain">
            <img :src="selectedRecipe?.imgPath" class="recipe-image-bg" />
            <div class="recipe-name">
              <h4>{{ selectedRecipe?.name }}</h4>
            </div>
          </div>
          <div class="recipe-description">
            <div class="description-box">
              <h4 class="recipe-description-title">Description:</h4>
              <p class="recipe-description-text">
                {{ selectedRecipe?.description }}
              </p>
            </div>
            <div class="ratingbar">
              <div class="ratingbar-left"><span class="ratingbar-text">Rating: </span>{{ selectedRecipe?.rating }}</div>
              <div class="ratingbar-right"><span class="ratingbar-text">Public Recipe: </span>
                <SwitchRoot
                  class="switch-outer"
                  id="public-recipe-switch"
                  v-model:checked="switchState"
                  >
                  <SwitchThumb class="switchthumb" />
                </SwitchRoot>
              </div>
            </div>
          </div>
        </div>
</template>
<style lang="sass">
@import '@/assets/variables.sass'

.recipe-header
  width: 100%
  min-height: 100px
  display: flex
  flex-direction: column

  @media (min-width: 768px)
    flex-direction: row
    height: 300px


.recipe-image-contain
  position: relative
  width: 100%

  @media (min-width: 768px)
    width: 50%

.recipe-image-bg
  width: 100%
  min-height: 100px
  object-fit: cover
  object-position: center
  border-radius: 5px
  max-height: 100px
  padding-left: 10px
  padding-right: 10px

  @media (min-width: 768px)
    max-height: 300px
    border-radius: 10px

.recipe-name
  position: absolute
  bottom: 0
  display: flex
  justify-content: center
  align-items: center
  width: 100%
  background-color: rgba(255,255,255,0.9)
  height: 30px

  h4
    margin: 0

.recipe-description
  margin-top: 10px
  display: flex
  flex-direction: column
  justify-content: space-between

  @media (min-width: 768px)
    width: 50%

.recipe-description-title
  margin: 0 5px 5px

  @media (min-width: 768px)
    margin: 0 10px 10px

.recipe-description-text
  padding: 0 10px
  margin: 0

  @media (min-width: 768px)
    padding: 0 20px

.ratingbar
  display: flex
  flex-direction: row
  justify-content: space-between

.ratingbar-text
  font-size: 0.7em

// Radix Switch CSS in Global as required

.Label 
  color: white
  font-size: 15px
  line-height: 1

</style>