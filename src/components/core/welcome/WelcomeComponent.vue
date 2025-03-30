<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import CollectionComponent from '../collections/CollectionComponent.vue'
import { useRecipeStore } from '@/stores/recipe'
import { computed, onMounted, Ref, ref, unref } from 'vue'
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import UnsavedDataModalComponent from '@/components/core/welcome/unsavedDataModal/UnsavedDataModalComponent.vue';
import RecipeDetailsComponent from '@/components/core/recipeList/recipeDetails/recipeDetailsComponent.vue';
import { Recipe } from '@/types/Recipes';
import { ExposedInWelcomeComponent } from '@/types/componentExposedValues';
import VerificationModalComponent from './verificationModal/VerificationModalComponent.vue';


// Testing required more reactivity
const props = defineProps({
  currentTime: {
    type: [Object],
    required: false,
    default: () => new Date(),
  },
});

const recipeStore = useRecipeStore()
const appStore = useAppStore()
const userStore = useUserStore()


let ethansFavouriteRecipes = ref<Recipe[]>([]);
let recommendedRecipes = ref<Recipe[]>([]);
let mealTimeRecipes = ref<Recipe[]>([]);
let healthyRecipes = ref<Recipe[]>([]);
let snackRecipes = ref<Recipe[]>([]);

onMounted(() => {
  const [ethanFavs, recommended, mealTime, snack, healthy] = recipeStore.generatePublicRecipeCollections();

  ethansFavouriteRecipes.value = ethanFavs.value;
  recommendedRecipes.value = recommended.value;
  mealTimeRecipes.value = mealTime.value;
  healthyRecipes.value = healthy.value;
  snackRecipes.value = snack.value;
});
let recipeDetailsOpen = ref(false)
let verifiedUser = userStore.isUserVerified;

const currentTime = computed(() => {
  const rawTime = unref(props.currentTime);
  if (rawTime instanceof Date) {
    return rawTime;
  } else {
    console.warn('Invalid currentTime prop. Falling back to new Date.');
    return new Date();
  }
});

const greeting = computed((): string => {
  const displayName = userStore.localUser.displayName
  if (displayName) {
    return `Welcome, ${displayName}!` 
  } else {
    return `Welcome!` 
  }
})


const mealTime = computed(() => {
  return determineMealTime(currentTime.value.getHours());
});

function determineMealTime(hours: number) {
  if (hours >= 2 && hours < 10) {
    return 'Breakfast'
  } else if (hours >= 10 && hours < 16) {
    return 'Lunch'
  } else {
    return 'Dinner'
  }
}


function handleUserResponse(userResponse: string) {
  console.log(userResponse)
  appStore.showUnsavedChangesModal = false
}

function closeRecipeDetails() {
  console.log('closeRecipeDetails called'); // Debugging
  recipeDetailsOpen.value = false
  recipeStore.setSelectedRecipeId('')
}

defineExpose<ExposedInWelcomeComponent>({
  ethansFavouriteRecipes,
  recommendedRecipes,
  mealTimeRecipes,
  healthyRecipes,
  snackRecipes,
  recipeDetailsOpen,
  closeRecipeDetails,
});
</script>

<template>
  <div class="base-container welcome">
    <h1 class="greeting">{{greeting}}</h1>
    <h2>What's for Supper?</h2>
    <div class="searchbar">
      <input disabled type="text" class="searchbar-input" placeholder="Burritos" />
      <button disabled><Search class="magnifying" :size="15" /></button>
    </div>
    <span style="font-size: 0.7em;">Search and Public Recipe Filtering Coming Soon!</span>
    <div class="base-content-container">
      <CollectionComponent ref="recommended-recipes-collection" title="Recommended Public Recipes" :recipeData="recommendedRecipes" />
      <CollectionComponent title="Ethan's Favourites" :recipeData="ethansFavouriteRecipes" />
      <CollectionComponent ref="mealtime-collection" :title="'Ready for ' + mealTime" :recipeData="mealTimeRecipes" />
      <CollectionComponent title="Snacks" :recipeData="snackRecipes" />
      <CollectionComponent title="Healthy Foods" :recipeData="healthyRecipes" />
    </div>
  </div>
  <RecipeDetailsComponent 
    v-if="recipeStore.selectedRecipeId" 
    @closeRecipeDetails="() => { console.log('Event received'); closeRecipeDetails(); }" 
  />
  <UnsavedDataModalComponent v-if="appStore.showUnsavedChangesModal" :close="handleUserResponse('save')" />
  <VerificationModalComponent v-if="!verifiedUser" :permanent="true" />

</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *

h1
  margin-bottom: 0

h2
  margin: 5px 0

.searchbar
  width: 90%
  display: flex

  @media (min-width: 768px)
    width: 50%

  .searchbar-input
    line-height: 1em
    vertical-align: middle
    flex-grow: 1

    @media (min-width: 768px)
      line-height: 2em

  button
    margin-left: 10px
    line-height: 2em
    vertical-align: middle
    width: 24px
    height: 24px
    border-radius: 5px
    cursor: pointer
    border: 1px solid $colorMiddle

    &:hover
      background-color: $colorLighter

    &:focus
      background-color: $colorLighter
      

  .magnifying
    display: flex
    align-items: center
    width: 100%

</style>
