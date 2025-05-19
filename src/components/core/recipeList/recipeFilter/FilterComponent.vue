<script setup lang="ts">
import { ref, defineEmits, reactive, toRaw } from 'vue'
import { Filter, CircleX } from 'lucide-vue-next'
import CheckboxComponent from '../../shared/checkbox/CheckboxComponent.vue'
import { useRecipeStore } from '@/stores/recipeStore'

const recipeStore = useRecipeStore()
const emit = defineEmits(['filter'])
defineProps({
  filters: Array as () => string[]
})

let mobileFiltersOpen = ref(false)
let allUserTags = ref<String[]>([...recipeStore.getAllRecipeTags])
// const filterState = reactive<{ [key: string]: boolean }>({})
let filterList = ref(allUserTags.value as string[])
let isFiltersOpen = ref(false)

const usersPersonalFilters = recipeStore.personalFilters

//TODO create/alter/disabled on recipe load based on user's reciepes?
const mealTypes = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack'] 


const filterState: any = ref({
  mealType: [],
  includedTags: [],
  excludedTags: [],
  personalTags: usersPersonalFilters
})

function toggleShowFilters() {
  isFiltersOpen.value = !isFiltersOpen.value
}
function filterButtonOnClick() {
  console.log('filterState: ', filterState)
  toggleShowFilters()
}

function updateMealType(type: string, isSelected: boolean) {
  if (isSelected) {
    filterState.value.mealType.push(type)
  } else {
    const index = filterState.value.mealType.indexOf(type)
    if (index > -1) {
      filterState.value.mealType.splice(index, 1)
    }
  }

}
</script>

<template>
  <div class="filter-button" @click="toggleShowFilters()">
    <button class="filter-btn-icon">
      <Filter class="filter-icon" />
    </button>
    <span class="filter-text">Filters</span>
  </div>
  <Teleport to="body">
    <div class="filter-box floating" v-if="isFiltersOpen">
      <div class="filter-not-working">Filtering waiting for final schema</div>
      <CircleX class="button-close" @click="toggleShowFilters()"/>
      <div class="filters-contain">
        <div class="filter-category">
          <span>Meal Type:</span>
          <div class="checkboxes-contain">
            <CheckboxComponent
              v-for="(type, index) in mealTypes"
              :key="index"
              :checkboxLabel="type"
              @update:modelValue="(isSelected) => updateMealType(type, isSelected)"
            />
          </div>
        </div>
        <div class="filter-category inclusive"><label for="includedtags">Included Tag(s): </label><input v-model="filterState.includedTags" type="text" id="includedtags" placeholder="onion, potato, mango"></div>
        <div class="filter-category exclusive"><label for="excludedtags">Excluded Tag(s): </label><input v-model="filterState.excludedTags" type="text" id="excludedtags" placeholder="tears, monkshood, cyanide"></div>
      </div>
      <button class="filter-btn-submit" @click="filterButtonOnClick()">Filter</button>
      <div class="filter-not-working">Filtering waiting for final schema</div>
    </div>
  </Teleport>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *

.filter-not-working
  text-align: center
  margin: 10px 0
  font-size: 1.2em
  color: red

.filter-button
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  cursor: pointer
  filter: grayscale(100%)

  &:hover
    .filter-btn-icon
      filter: grayscale(40%)
      background-color: #d0d0d0
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)

  &:active
    .filter-btn-icon
      filter: grayscale(20%)
      background-color: #bbb

  &:focus
    .filter-btn-icon
      outline: none
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5)

.filter-btn-icon
  background-color: $colorLighter
  color: #333
  border: 1px solid $colorMiddle
  border-radius: 5px
  font-family: 'Arial', sans-serif
  transition: all 0.3s ease
  cursor: pointer
  padding: 2px

.filter-icon
  display: flex
  height: 15px
  width: 15px

.filter-text
  font-size: clamp(10px, 1.5vw, 15px)

.filter-box
  display: none
  padding: 10px
  width: 50vw
  height: 300px
  border: 1px solid black

  @media (min-width: 768px)
    display: block
    height: 300px

.floating
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  position: absolute
  top: calc(50vh - (200px / 2))
  left: calc(50vw - (50vw / 2))
  background-color: white
  border-radius: 5px

.filter-title
  // display: none
  text-align: center
  cursor: pointer

  @media (min-width: 768px)
    display: block

.button-close
  position: absolute
  top: 0px
  right: 0px
  cursor: pointer

.filters-contain
  display: flex
  flex-direction: row
  flex-wrap: wrap

.filter-category
  display: flex
  flex-direction: row
  flex-wrap: wrap
  margin-bottom: 8px

.checkboxes-contain
  display: flex
  flex-wrap: wrap

.filter-btn-submit
  width: 50px
  height: 30px
  background-color: $colorMiddle
  cursor: pointer
  border-radius: 3px
  color: $colorLighter
  text-align: center
</style>
