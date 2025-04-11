<script setup lang="ts">
import { computed, onMounted, Ref, ref, unref, watch } from 'vue'
import { useRoute } from 'vue-router';
import { Search } from 'lucide-vue-next'

import { useRecipeStore } from '@/stores/recipe'
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';

import RecipeDetailsComponent from '@/components/core/recipeList/recipeDetails/recipeDetailsComponent.vue';
import AuthComponent from '../auth/AuthComponent.vue';
import CollectionComponent from '../collections/CollectionComponent.vue'
import SplashComponent from './splash/SplashComponent.vue';

import { useAuthService } from '@/composables/useAuthService';
import { useDataService } from '@/composables/useDataService';

import { Recipe } from '@/types/Recipes';
import { ExposedInWelcomeComponent } from '@/types/componentExposedValues';


// Testing required more reactivity
const props = defineProps({
  currentTime: {
    type: [Object],
    required: false,
    default: () => new Date(),
  },
});

const appStore = useAppStore();
const userStore = useUserStore();
const recipeStore = useRecipeStore();
const authService = useAuthService();
const dataService = useDataService();

const route = useRoute();
const validToken = ref(false);
const isLoading = ref(false);
let ethansFavouriteRecipes = ref<Recipe[]>([]);
let recommendedRecipes = ref<Recipe[]>([]);
let mealTimeRecipes = ref<Recipe[]>([]);
let healthyRecipes = ref<Recipe[]>([]);
let snackRecipes = ref<Recipe[]>([]);

onMounted(async () => {
  if (recipeStore.existingPublicRecipesLength === 0) {
    try {
      console.log('public recipes are empty, getting from API')
      await dataService.initialLoadPublicRecipeData();
    } catch (error) {
      console.log('loading public recipes error: ', error)
    }
  }
  const [ethanFavs, recommended, mealTime, snack, healthy] = recipeStore.generatePublicRecipeCollections();
  console.log('public recipe setting')
  ethansFavouriteRecipes.value = ethanFavs.value;
  recommendedRecipes.value = recommended.value;
  mealTimeRecipes.value = mealTime.value;
  healthyRecipes.value = healthy.value;
  snackRecipes.value = snack.value;
});
let recipeDetailsOpen = ref(false)
const isAuthModalOpen = computed(() => appStore.isAuthModalOpen)

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
  const displayName = userStore.localUser?.displayName
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
  } else if (hours >= 10 && hours < 15) {
    return 'Lunch'
  } else {
    return 'Dinner'
  }
}

function closeRecipeDetails() {
  console.log('closeRecipeDetails called'); // Debugging
  recipeDetailsOpen.value = false
  recipeStore.setSelectedRecipeId('', false)
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

onMounted(async () => {
  console.log('mounting')
  const token = route.query.token as string;
  if (token) {
    try {
      await authService.validatePasswordToken(token);
      validToken.value = true;
      appStore.setAuthModalType('set-password');
    } catch (error) {
      console.log('passwrod reset token verification error: ', error);
      // TODO Pop up to say failed and allow resend? Modal?
    } finally {
      isLoading.value = false;
    }
  }
})
</script>

<template>
  <div class="welcome-container">
    <div v-if="isLoading">... Page is loading</div>
    <div class="guest-welcome" v-if="!userStore.authorized">
      <SplashComponent />
    </div>
    <div class="welcome">
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
    <div class="attribute">
      <a href="https://nick-karvounis.com/" target="_blank">Photo by Nick Karvounis on Unsplash</a>
    </div>
  </div>

  <RecipeDetailsComponent 
    v-if="recipeStore.selectedRecipeId" 
    @closeRecipeDetails="() => { console.log('Event received'); closeRecipeDetails(); }" 
  />
  <AuthComponent v-if="isAuthModalOpen"></AuthComponent>

</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *

.welcome-container
  display: flex
  align-items: center
  flex-direction: column
  height: calc(95vh - $navbar-height)
  width: 95vw
  
  @media (min-width: 768px)
    max-width: 1366px

.guest-welcome
  height: 480px
  margin-bottom: 20px
  
  @media (min-width: 768px)
    margin-bottom: 50px

.welcome, .guest-welcome
  display: flex
  align-items: center
  flex-direction: column
  background-color: white
  border-radius: 5px
  overflow-y: auto
  width: 100%

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

.attribute
  position: absolute
  bottom: 0px
  right: 25px
  font-size: .6rem

  @media (min-width: 768px)
    bottom: 50
    right: 50
    font-size: .8rem


  a
    color: white

</style>
