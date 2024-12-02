<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Recipe } from '@/types/Recipes' 
import { useRecipeStore } from '@/stores/recipe'
import UserImageUploadComponent from '../../shared/userImageUpload/UserImageUploadComponent.vue'
import { useImageUpload } from '@/composables/useImageUpload'

const emit = defineEmits(['editingCanceled'])

let formValid = false
let formData: Ref<Recipe>
let updatedImageURL = ''

const recipeStore = useRecipeStore()
const { deleteImage } = useImageUpload()

const selectedRecipe: Recipe | undefined = recipeStore.getSelectedRecipe

if (selectedRecipe) {
  formData = ref<Recipe>({
    ...JSON.parse(JSON.stringify(selectedRecipe)),
    ingredients: selectedRecipe.ingredients
      ? JSON.parse(JSON.stringify(selectedRecipe.ingredients))
      : [],
    directions: selectedRecipe.directions
      ? JSON.parse(JSON.stringify(selectedRecipe.directions))
      : [],
    tags: selectedRecipe.tags ? JSON.parse(JSON.stringify(selectedRecipe.tags)) : []
  })
} else {
  formData = ref({ ingredients: [], directions: [], tags: [] })
}

function onSubmit() {
  console.log('saving: ', formData.value)
  if (formData?.value && selectedRecipe) {
    console.log('Updating existing Recipe')
    recipeStore.updateRecipe(formData.value)
  } else if (formData) {
    console.log('Creating New Recipe')
    recipeStore.addRecipe(formData.value)
  }
  //TODO add new tags
  // const allUserTags: string[] = Array.from(
  //   new Set(userData?.recipes.flatMap((recipe: Recipe) => recipe.tags))
  // )
  onEditingOver()
}

function onEditingOver() {
  emit('editingCanceled')
}

function onDeleteIngredientType(ingredientTypeIndex: number) {
  formData.value.ingredients.splice(ingredientTypeIndex, 1)
}

function onDeleteDirectionType(directionTypeIndex: number) {
  formData.value.directions.splice(directionTypeIndex, 1)
}

function onDeleteIngredient(ingredientTypeIndex: number, ingredientIndex: number) {
  formData.value.ingredients[ingredientTypeIndex].steps.splice(ingredientIndex, 1)
}

function onDeleteDirection(directionTypeIndex: number, directionIndex: number) {
  formData.value.directions[directionTypeIndex].steps.splice(directionIndex, 1)
}

function onAddIngredientType() {
  console.log('adding')
  formData.value.ingredients.push({ title: '', steps: [{}] })
}

function onAddIngredient(ingredientIndex: number) {
  formData.value.ingredients[ingredientIndex].steps.push({})
}

function onAddDirectionType() {
  formData.value.directions.push({ title: '', steps: [''] })
}

function onAddDirection(ingredientIndex: number) {
  formData.value.directions[ingredientIndex].steps.push('')
}

async function removeImage() {
  if (formData.value.imgPath) {
    formData.value.imgPath = ""
    const success = await deleteImage(formData.value.imgPath)
    if (!success) {
      console.error('Failed to delete image from Cloudinary')
    }
    console.log('removing image path')
  }
}

function saveImagePath(uploadedImgURL: string) {
  console.log('saving image path')
  formData.value.imgPath = uploadedImgURL
}
</script>

<template>
  <div class="recipe-item-contain">
    <div class="overlay-shadow" @click="onEditingOver"></div>
    <div class="recipe-overlay edit">
      <div class="overlay-contain edit">
        <div class="form-contain">
          <form @submit.prevent="onSubmit">
            <div class="save-cancel-btns text-center">
              <button type="submit" :class="{ valid: formValid }" class="recipe-edit-button save">
                Save
              </button>
              <button type="button" class="recipe-edit-button cancel" @click="onEditingOver">
                Cancel
              </button>
            </div>
            <div class="edit-header-contain">
              <div class="edit-header-column">
                <div class="form-group">
                  <div>
                    <label>Recipe Image</label>
                    <span class="remove-image" @click="removeImage" v-if="formData.imgPath">Remove Image</span>
                  </div>
                  <img
                    :src="formData.imgPath"
                    class="img-responsive recipe-edit-image"
                    v-if="formData.imgPath"
                  />
                  <UserImageUploadComponent @upload-complete="saveImagePath" v-else />
                </div>
              </div>
              <div class="edit-header-column">
                <div class="form-group">
                  <label for="name">Recipe Name</label>
                  <input type="text" id="name" class="form-control" v-model="formData.name" />
                </div>
                <div class="form-group">
                  <label for="description">Description</label>
                  <textarea
                    type="text"
                    id="description"
                    class="form-control recipe-description-area"
                    v-model="formData.description"
                    rows="6"
                  ></textarea>
                </div>
              </div>
            </div>
            <hr />
            <div class="item-group-contain" formGroupName="ingredients">
              <div class="item-contain" v-for="(ingredientType, i) of formData.ingredients" :key="i">
                <div class="form-group item-type-contain">
                  <label class="section-title" for="ingredient-group{{i}}"
                    >INGREDIENT GROUP NAME:</label
                  >
                  <div class="item-type-row">
                    <input
                      type="text"
                      class="form-control item-type-input"
                      id="ingredient-group{{i}}"
                      v-model="formData.ingredients[i].title"
                    />
                    <button
                      type="button"
                      class="btn-delete"
                      @click="onDeleteIngredientType(i)"
                    ></button>
                  </div>
                  <div class="item-list-contain">
                    <div class="section-title">INGREDIENTS:</div>
                    <div class="item-list">
                      <div class="item-each" v-for="(ingredient, j) of ingredientType.steps" :key="j">
                        <div class="item-each-container">
                          <div>
                            <label class="hidden" for="ingredient-{{j}}">Amount</label>
                            <div class="item-input-row">
                              <input
                                type="text"
                                class="form-control item-input"
                                v-model="formData.ingredients[i].steps[j].amount"
                                id="ingredient-{{j}}"
                              />
                            </div>
                          </div>
                          <div>
                            <label class="hidden" for="ingredient-{jp}}">Unit</label>
                            <div class="item-input-row">
                              <input
                                type="text"
                                class="form-control item-input"
                                v-model="formData.ingredients[i].steps[j].unit"
                                id="ingredient-{{j}}"
                              />
                            </div>
                          </div>
                          <div>
                            <label class="hidden" for="ingredient-{{j}}">Name</label>
                            <div class="item-input-row">
                              <input
                                type="text"
                                class="form-control item-input"
                                v-model="formData.ingredients[i].steps[j].name"
                                id="ingredient-{{j}}"
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          class="btn-delete"
                          @click="onDeleteIngredient(i, j)"
                        ></button>
                      </div>
                      <div class="item-each">
                        <button type="button" class="btn btn-clear" @click="onAddIngredient(i)">
                          + Add Ingredient
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
              <div class="row">
                <div class="col-xs-12">
                  <button type="button" class="btn btn-clear" @click="onAddIngredientType()">
                    + Add Ingredient Group
                  </button>
                </div>
              </div>
            </div>
            <hr />
            <div class="item-group-contain" formGroupName="directions">
              <div class="item-contain" v-for="(directionType, k) of formData.directions" :key="k">
                <div class="form-group">
                  <label class="section-title" for="direction-group{{k}}">DIRECTION GROUP NAME</label>
                  <div class="item-type-row">
                    <input
                      type="text"
                      class="form-control item-type-input"
                      v-model="directionType.title"
                      id="direction-group{{k}}"
                    />
                    <button
                      type="button"
                      class="btn-delete"
                      @click="onDeleteDirectionType(k)"
                    ></button>
                  </div>
                  <div class="item-list-contain">
                    <div class="section-title">DIRECTIONS</div>
                    <div class="item-list">
                      <div class="item-each" v-for="(direction, l) of directionType.steps" :key="l">
                        <div>
                          <label class="hidden" for="direction{{l}}">DIRECTION</label>

                          <div class="item-input-row">
                            <input
                              type="text"
                              class="form-control"
                              v-model="directionType.steps[l]"
                              id="direction{{l}}"
                            />
                            <button
                              type="button"
                              class="btn-delete"
                              @click="onDeleteDirection(k, l)"
                            ></button>
                          </div>
                        </div>
                      </div>
                      <div class="item-each">
                        <button type="button" class="btn btn-clear" @click="onAddDirection(k)">
                          + Add Direction
                        </button>
                      </div>
                    </div>
                    <hr />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-12">
                  <button type="button" class="btn btn-clear" @click="onAddDirectionType()">
                    + Add Direction Group
                  </button>
                </div>
              </div>
              <hr />
            </div>
            <div style="margin-bottom: 25px"></div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="sass">
input.ng-invalid.ng-touched,
textarea.ng-invalid.ng-touched
    border: 1px solid red

.form-contain
    padding: 15px
    width: 100%
    overflow-y: auto
    height: 100%

.recipe-edit-container
    overflow: auto

.save-cancel-btns
    position: absolute
    top: -59px
    left: 50%
    height: 60px
    display: flex
    justify-content: space-between
    transform: translate(-50%, 0)

label
    // color: #eef
    margin-left: 5px

.edit-header-contain
    display: flex
    flex-direction: row

.edit-header-column
    display: flex
    flex-direction: column
    width: 50%
    padding: 10px

.form-group
    display: flex
    flex-direction: column

.form-control
    font-size: 1rem
    padding: 5px 5px

.recipe-edit-image
    object-fit: cover
    border-radius: 5px
    width: 100%
    max-width: 100%
    height: auto

    @media (min-width: 768px)
        border-radius: 10px

.recipe-description-area
    max-width: 100%
    max-height: 200px

.section-title
    margin-bottom: 10px
    font-size: 1.2em
    // color: #eef
    font-weight: 500
    margin-left: 0

.item-type-contain
    width: 100%

.item-type-row
    display: flex
    width: 100%
    margin-bottom: 10px

    @media (min-width: 768px)
        width: 33%

.item-type-input
    margin-left: 5px
    width: 80%

.item-list
    display: flex
    flex-wrap: wrap
    width: 100%

.item-each
    width: 100%
    padding: 5px

    @media (min-width: 768px)
        width: 33%

.item-input-row
    display: flex

.item-input
    width: 80%

.btn-clear
    cursor: pointer
    // background: transparent
    // color: #eeeeff

    // &:hover
    //     background: rgba(255,255,255,.2)

.btn-delete
    background: transparent
    color: #eeeeff
    border: none
    width: 35px
    padding: 0
    position: relative
    transform: rotate(45deg)

    &:before
        content: ''
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        width: 3px
        height: 20px
        background: #eeeeff

    &:after
        content: ''
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        width: 20px
        height: 3px
        background: #eeeeff


    &:hover
        &:before, &:after
            background: #A41C1C
</style>
