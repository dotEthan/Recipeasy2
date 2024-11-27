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

filterList.value.forEach((filter) => {
  filterState[filter] = false
})

function toggleShowFilters() {
  mobileFiltersOpen.value = !mobileFiltersOpen.value
}
function filterButtonOnClick() {
  if (mobileFiltersOpen.value === true) mobileFiltersOpen.value = false
  const activeFilters = Object.keys(toRaw(filterState)).filter((key) => filterState[key])
  recipeStore.setActiveFilters(activeFilters)
  emit('filter')
}

//TODO Update filters when adding and removing
</script>

<template>
  <button class="filter-btn-mobile" @click="toggleShowFilters()">
    <Filter class="filter-icon" />
  </button>
  <div class="filter-box" :class="{ floating: mobileFiltersOpen }">
    <h2 class="filter-title">Filters</h2>
    <CircleX class="button-close" @click="toggleShowFilters()" v-if="mobileFiltersOpen" />
    <div class="filters-contain">
      <CheckboxComponent
        v-for="(filter, index) in allRecipeTags"
        :key="index"
        :checkboxLabel="filter"
        v-model="filterState[filter]"
      />
    </div>
    <button @click="filterButtonOnClick()">Filter</button>
  </div>
</template>

<style lang="sass">


.filter-btn-mobile
  position: absolute
  top: -50px
  right: 20px
  display: flex
  padding: 6px 12px
  background-color: #e0e0e0
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
</style>
