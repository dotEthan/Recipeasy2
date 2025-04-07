<script setup lang="ts">
import DOMPurify from 'dompurify';
import { nextTick, onMounted, ref } from 'vue';
import type { ComponentPublicInstance, Ref } from 'vue';
import type { Recipe } from '@/types/Recipes' ;
import { useRecipeStore } from '@/stores/recipe';
// import UserImageUploadComponent from '../../shared/userImageUpload/UserImageUploadComponent.vue';
// import { useImageUpload } from '@/composables/useImageUpload';
import ToolTipComponent from '../../shared/toolTip/ToolTipComponent.vue';
import { useUserStore } from '@/stores/user';

//TODO Refactor into multiple components 'header', 'ingredients', 'directions'

const props = defineProps({
  isNew: Boolean,
});
const emit = defineEmits(['editingFinished','recipeDeleted']);

let formValid = true;
let formData: Ref<Recipe>;
let formError = ref('');

const recipeStore = useRecipeStore();
const userStore = useUserStore();
// const { deleteImage } = useImageUpload();

const selectedRecipe: Recipe = recipeStore.getSelectedRecipe;
const amountRefs = ref<Record<string, HTMLInputElement | Element | ComponentPublicInstance>>({});
const ingredientTypeRefs = ref<Record<string, HTMLInputElement | Element | ComponentPublicInstance>>({});
const directionRefs = ref<Record<string, HTMLInputElement | Element | ComponentPublicInstance>>({});
const directionTypeRefs = ref<Record<string, HTMLInputElement | Element | ComponentPublicInstance>>({});
let tagInput = ref('');

// onMounted(() => {
//   populateForm();
// })
// TODO wont work in onMounted, figure out why
populateForm();

function populateForm() {
  console.log('is this new: ', props.isNew)
  if(!props.isNew) {
    formData = ref<Recipe>({
      // Deep Clones the object
      ...JSON.parse(JSON.stringify(selectedRecipe)),
      ingredients: selectedRecipe?.ingredients
        ? JSON.parse(JSON.stringify(selectedRecipe.ingredients))
        : [],
      directions: selectedRecipe?.directions
        ? JSON.parse(JSON.stringify(selectedRecipe.directions))
        : [],
      tags: selectedRecipe?.tags ? JSON.parse(JSON.stringify(selectedRecipe.tags)) : []
    })
  } else {
    const newRecipe = {
      _id: recipeStore.selectedRecipeId,
      name: 'Default Recipe',
      ingredients: [{ title: 'Ingedients', steps: [] }],
      directions: [{ title: 'Directions', steps: [] }],
      description: '',
      tags: [],
      notes: [],
      info: {},
      userId: userStore.getCurrentUserId,
      visibility: 'public',
    } as Recipe
    console.log('creating new default recipe: ', selectedRecipe)
    formData = ref(newRecipe)
  }
}

function onSubmit() {
  const publicStatusChanged = (selectedRecipe?.visibility !== formData.value.visibility) ? true : false
  console.log('did public status Change?: ', publicStatusChanged)
  if (publicStatusChanged && formData.value.visibility === 'private') {
    console.log('remove from Public')
    recipeStore.removeFromPublicRecipes(formData.value._id)
  } else if ((publicStatusChanged || props.isNew) && formData.value.visibility === 'public') {
    console.log('add to Public')
    if (!formData.value.visibility) formData.value.visibility = 'public'
    recipeStore.addToPublicRecipes(formData.value)
  }
  if (formData.value.url) {
    const santizedUrl = DOMPurify.sanitize(formData.value.url)
    formData.value.url = santizedUrl
  }
  if (formData?.value && !props.isNew) {
    console.log('Updating existing Recipe')
    recipeStore.updateRecipe(formData.value)
    onEditingOver()
  } else if (formData?.value && formValid) {

    console.log('Creating New Recipe')
    recipeStore.addRecipe(formData.value)
    onEditingOver()
  } else {
    console.log('not valid')
  }
  //TODO add new tags (ingredients, cuisine, meal type)
  // const allUserTags: string[] = Array.from(
  //   new Set(userData?.recipes.flatMap((recipe: Recipe) => recipe.tags))
  // )
}

// TODO Better validation. 
function validateName() {
  console.log('validating Name: ', formData.value.name?.length)
  if (!formData.value.name || formData.value.name.length < 1) {
    formError.value = "Recipe Name Required"
    formValid = false
  } else {
    formError.value = ""
    formValid = true
  }
}

const onEditingOver = () => {
  if (props.isNew) {
    recipeStore.setSelectedRecipeId('', false)
  }
  emit("editingFinished");
}

function onAddIngredientType() {
  formData.value.ingredients.push({ title: '', steps: [{}] })
  nextTick(() => {
    const newStepIndex = formData.value.ingredients.length - 1;
    const refKey = `ingredientType-${newStepIndex}`
    const input = ingredientTypeRefs.value[refKey] as HTMLInputElement
    input?.focus()  
  });
}

function onDeleteIngredientType(ingredientTypeIndex: number) {
  formData.value.ingredients.splice(ingredientTypeIndex, 1)
}

function onAddDirectionType() {
  formData.value.directions.push({ title: '', steps: [''] })
  nextTick(() => {
    const newStepIndex = formData.value.directions.length - 1;
    const refKey = `directionType-${newStepIndex}`;
    const input = directionTypeRefs.value[refKey] as HTMLInputElement;
    input?.focus();
  });
}

function onDeleteDirectionType(directionTypeIndex: number) {
  formData.value.directions.splice(directionTypeIndex, 1)
}

function onAddIngredient(ingredientIndex: number) {
  if (!formData.value.ingredients[ingredientIndex].steps) formData.value.ingredients[ingredientIndex].steps = [];
  formData.value.ingredients[ingredientIndex].steps.push({});
  nextTick(() => {
    const newStepIndex = formData.value.ingredients[ingredientIndex].steps.length - 1
    const refKey = `amount-${ingredientIndex}-${newStepIndex}`
    const input = amountRefs.value[refKey] as HTMLInputElement
    input?.focus()  
  });
}

function onDeleteIngredient(ingredientTypeIndex: number, ingredientIndex: number) {
  formData.value.ingredients[ingredientTypeIndex].steps.splice(ingredientIndex, 1)
}

function onAddDirection(directionIndex: number) {
  if (!formData.value.directions[directionIndex].steps) formData.value.directions[directionIndex].steps = ['']
  formData.value.directions[directionIndex].steps.push('')
  nextTick(() => {
    const newStepIndex = formData.value.directions[directionIndex].steps.length - 1
    const refKey = `direction-${directionIndex}-${newStepIndex}`
    const input = directionRefs.value[refKey] as HTMLInputElement
    input?.focus()  
  });
}

function onDeleteDirection(directionTypeIndex: number, directionIndex: number) {
  formData.value.directions[directionTypeIndex].steps.splice(directionIndex, 1)
}

function onAddNote() {
  if (!formData.value.notes) formData.value.notes = []
  console.log('notes: ', formData.value.notes)
  formData.value.notes.push('')
}

function onDeleteNote(noteIndex: number) {
  formData.value.notes?.splice(noteIndex, 1)
}

async function removeImage() {
  if (formData.value.imgPath) {
    const imgPath = formData.value.imgPath
    formData.value.imgPath = ""
    // const success = await deleteImage(imgPath)
    // if (!success) {
    //   console.error('Failed to delete image from Cloudinary')
    // }
    console.log('removing image path')
  }
}

function saveImagePath(uploadedImgURL: string) {
  formData.value.imgPath = uploadedImgURL
}

function addTag() {
  const tagValue = tagInput.value.trim()
  if (tagValue) {
    formData.value.tags.push(tagValue)
    tagInput.value = ''
  }
}

function removeTag(i: number) {
  formData.value.tags.splice(i, 1)
}
</script>

<template>
  <div class="recipe-detail-container">
    <div class="overlay-shadow" @click="onEditingOver"></div>
    <div class="recipe-overlay edit">
      <div class="overlay-contain edit">
        <div class="form-contain">
          <form @submit.prevent="onSubmit">
            <div class="save-cancel-btns text-center">
              <div class="submit-btn">
                <button type="submit" :class="{ valid: formValid }" class="recipe-manage-btn save">
                  Save
                </button>
                <ToolTipComponent
                  :content="formError"
                  format="warning"
                  class="tooltip" 
                  v-bind:class="{ 'show-tooltip': !formValid }" />
              </div>
              <div class="cancel-btn">
                <button type="button" class="recipe-manage-btn cancel" @click="onEditingOver">
                  Cancel
                </button>
              </div>
            </div>
            <div class="edit-header-contain">
              <div class="edit-header-column">
                <div class="form-group">
                  <div class="image-title-bar">
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
                  <label for="name">Recipe Name*</label>
                  <input type="text" id="name" class="form-control" v-model="formData.name" @blur="validateName" />
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
                <div class="form-group">
                  <label for="url">Website URL:</label>
                  <input type="text" id="url" class="form-control" v-model="formData.url" />
                  <div class="public-choice">
                    <input type="radio" id="public" value='public' v-model="formData.visibility" />
                    <label for="public">Public</label>
                    <input type="radio" id="private" value='private' v-model="formData.visibility" />
                    <label for="private">Private</label>
                  </div>
                </div>
              </div>
            </div>
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
                      :ref="el => { if (el) ingredientTypeRefs[`ingredientType-${i}`] = el }"
                      placeholder="Main Dish"
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
                          <div class="item-each-row amount-row">
                            <label class="item-label" for="ingredient-{{j}}">Amount:</label>
                            <div class="item-input-row amount-input">
                              <input
                                type="text"
                                class="form-control item-input"
                                v-model="formData.ingredients[i].steps[j].amount"
                                id="`ingredient-${i}-${j}`"
                                :ref="el => { if (el) amountRefs[`amount-${i}-${j}`] = el }"
                                placeholder="1"
                              />
                            </div>
                          </div>
                          <div class="item-each-row unit-row">
                            <label class="item-label" for="ingredient-{jp}}">Unit:</label>
                            <div class="item-input-row unit-input">
                              <input
                                type="text"
                                class="form-control item-input"
                                v-model="formData.ingredients[i].steps[j].unit"
                                id="ingredient-{{j}}"
                                placeholder="cup"
                              />
                            </div>
                          </div>
                          <div class="item-each-row name-row">
                            <label class="item-label" for="ingredient-{{j}}">Name:</label>
                            <div class="item-input-row title-input">
                              <input
                                type="text"
                                class="form-control item-input"
                                v-model="formData.ingredients[i].steps[j].name"
                                id="ingredient-{{j}}"
                                placeholder="Pepper"
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
                      :ref="el => { if (el) directionTypeRefs[`directionType-${k}`] = el }"
                      placeholder="Main Dish"
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
                        <div class="item-each-row">
                          <label style="display: none" for="direction{{l}}">DIRECTION</label>

                          <div class="item-input-row directions-row">
                            <input
                              type="text"
                              class="form-control direction-input"
                              v-model="directionType.steps[l]"
                              :ref="el => { if (el) directionRefs[`direction-${k}-${l}`] = el }"
                              id="direction{{l}}"
                              placeholder="Cut, Stir, Bake"
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
            </div>
            <div class="item-group-contain">
              <div class="section-title">Tags:</div>
              <div class="tags-contain-list">
                <div class="existing-tag-grouping" v-for="(tag, m) in formData.tags" :key="m">
                  <div class="existing-tag">{{ tag }}</div>
                  <button type="button" class="btn-delete" @click="removeTag(m)"></button>
                </div>
              </div>
              <div class="tags-input">
                <label for="tagsInput">New Tag:</label>
                <input type="text" v-model="tagInput" name="tagsInput">   
                <div class="existing-tag-remove" @click="addTag()">Add Tag</div>             
              </div>
            </div>
            <div class="item-group-contain">
              <div class="section-title">Notes:</div>
              <div class="item-each" v-for="(note, n) of formData.notes" :key="n">
                <div class="item-each-row">
                  <label style="display: none" for="note{{n}}">NOTE</label>

                  <div class="item-input-row directions-row">
                    <input
                      type="text"
                      class="form-control direction-input"
                      v-model="formData.notes[n]"
                      id="note{{n}}"
                      placeholder="Be sure to wash your hands!"
                    />
                    <button
                      type="button"
                      class="btn-delete"
                      @click="onDeleteNote(n)"
                    ></button>
                  </div>
                </div>
              </div>
              <div class="item-each">
                <button type="button" class="btn btn-clear" @click="onAddNote()">
                  + Add Note
                </button>
              </div>
            </div>
            <div class="item-group-contain">
              <div class="section-title">Nutritional Info Coming Soon:</div>
            </div>
            <div style="margin-bottom: 25px"></div>
          </form>
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
    height: 60px
    display: flex
    justify-content: space-around

label
  margin-left: 5px

  @media (min-width: 768px)
    margin-left: 10px

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

.remove-image
  font-size: clamp(6px, 1.3vw, 24px)
  display: flex
  flex-direction: column
  justify-content: flex-end
  cursor: pointer  
  
.image-title-bar
  display: flex
  flex-direction: row
  justify-content: space-between

.form-control
    font-size: 1rem
    padding: 5px 5px
    width: 100%

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
    white-space: pre-wrap

.item-group-contain
  border-top: 1px solid black
  padding: 20px 0

.section-title
    margin-bottom: 10px
    font-size: 1.2em
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
    display: flex
    flex-direction: row

    // @media (min-width: 768px)
    //     width: 33%

.item-each-container
  display: flex
  flex-direction: row
  width: 100%

.item-each-row
  display: flex
  flex-direction: row
  align-items: center

.item-label
  margin-right: 15px

.amount-input
  width: 5vw

.unit-input
  width: 10vw

.title-input, .name-row
  flex-grow: 1

.btn-clear
  box-sizing: border-box 
  cursor: pointer
  border: 1px dashed transparent
  
  &:active, &:focus, &:hover
    border: 1px dashed black

.btn-delete
  background: transparent
  color: #eeeeff
  border: none
  width: 30px
  height: 30px
  padding: 0
  position: relative
  transform: rotate(45deg)
  cursor: pointer

  &:before, &:after
    content: ''
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    background: $colorLighter

  &:after
    width: 20px
    height: 3px

  &:before
    width: 3px
    height: 20px

  &:hover, &:active, &:focus

    &:before, &:after
        background: #A41C1C

.recipe-manage-btn
  background: $recipe-edit-bg
  height: 100%
  width: 100px
  border-radius: 10px 10px 0 0
  border: 0
  
  &.save
    color: $colorLighter
    margin-right: 110px
    cursor: not-allowed

    @media (min-width: 768px)
      margin-right: 200px

    &.valid
      cursor: pointer
      color: $colorDarker

      &:hover
        text-shadow: 0 0 10px #fff, 0 0 20px green, 0 0 30px green, 0 0 40px green

  &.cancel
    color: $colorDarker
    cursor: pointer

    &:hover
      text-shadow: 0 0 10px #fff, 0 0 20px red, 0 0 30px red, 0 0 40px red

.tooltip
  display: none

  
.submit-btn 
  position: relative
  
  &:hover
    .show-tooltip
      display: block

.item-each-row
  width: 100%

.directions-row
  display: flex
  flex-direction: row
  width: 100%

.direction-input
  flex-grow: 1

.add-tag-btn 
  margin-left: 10px
  font-size: clamp(8px, 3.5vw, 12px)

.tags-contain
  margin-top: 20px

.tags-contain-list
  display: flex
  flex-direction: row
  flex-wrap: wrap

.existing-tag-grouping
  display: flex
  flex-direction: row
  align-items: center
  margin-right: 10px
  margin-bottom: 10px

.existing-tag
  margin-right: 5px
  border: 1px dashed $colorDarker
  padding: 3px
  border-radius: 3px

.existing-tag-remove
  cursor: pointer
  border: 1px solid transparent

  &:active, &:focus, &:hover
    border: 1px solid black
  
.tags-input
  display: flex
  flex-direction: row
  margin-top: 20px

  label
    margin-right: 5px
    margin-left: 0
  

</style>
