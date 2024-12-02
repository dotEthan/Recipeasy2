<script setup lang="ts">
import { ref, defineEmits, reactive, toRaw } from 'vue'
import { Filter, CircleX } from 'lucide-vue-next'
import CheckboxComponent from '../../shared/checkbox/CheckboxComponent.vue'
import { useUserStore } from '@/stores/user'
import { useRecipeStore } from '@/stores/recipe'

const recipeStore = useRecipeStore()
const userStore = useUserStore()
const emit = defineEmits(['filter'])
defineProps({
  allRecipeTags: Array as () => string[]
})

let mobileFiltersOpen = ref(false)
let allUserTags = ref<String[]>([...recipeStore.getAllRecipeTags])
const filterState = reactive<{ [key: string]: boolean }>({})
let filterList = ref(allUserTags.value as string[])
let isFiltersOpen = ref(false)

filterList.value.forEach((filter) => {
  filterState[filter] = false
})

function toggleShowFilters() {
  mobileFiltersOpen.value = !mobileFiltersOpen.value
}
function filterButtonOnClick() {
  if (mobileFiltersOpen.value === true) mobileFiltersOpen.value = false
  const activeFilters = Object.keys(toRaw(filterState)).filter((key) => filterState[key])
  // recipeStore.setActiveFilters(activeFilters)
  emit('filter', activeFilters)
}

function openFilters() {
  isFiltersOpen.value = !isFiltersOpen.value
}

//TODO Update filters when adding and removing
</script>

<template>
  <button class="filter-btn-mobile" @click="toggleShowFilters()">
    <Filter class="filter-icon" />
  </button>
  <h2 class="filter-title" @click="openFilters">Filters</h2>
  <div class="filter-box" :class="{ floating: mobileFiltersOpen }" v-if="isFiltersOpen">
    <h3 style="text-align: center;">Proper Filtering structure coming soon!</h3>
    <CircleX class="button-close" @click="toggleShowFilters()" v-if="mobileFiltersOpen" />
    <div class="filters-contain">
      <CheckboxComponent
        v-for="(filter, index) in allRecipeTags"
        :key="index"
        :checkboxLabel="filter"
        v-model="filterState[filter]"
      />
    </div>
    <button class="filter-btn-submit" @click="filterButtonOnClick()">Filter</button>
  </div>
</template>

<style lang="sass">
@import '../../../../assets/variables.sass'


.filter-btn-mobile
  position: absolute
  top: -50px
  right: 20px
  display: flex
  padding: 6px 12px
  background-color: $colorLighter
  color: #333
  border: none
  border-radius: 30px
  font-family: 'Arial', sans-serif
  font-size: 16px
  cursor: pointer
  transition: all 0.3s ease
  filter: grayscale(100%)
  text-align: center

  &:hover
    filter: grayscale(40%)
    background-color: #d0d0d0
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)

  &:active
    filter: grayscale(20%)
    background-color: #bbb

  &:focus
    outline: none
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5)

  @media (min-width: 768px)
    display: none

.filter-icon
  height: 15px
  width: 15px

.filter-box
  display: none

  @media (min-width: 768px)
    display: block

.floating
  display: block
  position: absolute
  top: 0
  left: 0
  background-color: white
  z-index: 1
  border-radius: 5px

.filter-title
  // display: none
  text-align: center
  cursor: pointer

  @media (min-width: 768px)
    display: block

.button-close
  position: absolute
  top:15px
  right:25px
  cursor: pointer

.filters-contain
  display: flex
  flex-direction: row
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
