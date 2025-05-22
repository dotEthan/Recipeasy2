<script setup lang="ts">
/**
 * Component to display Welcome page for all users
 * @todo Redesign as View
 * @todo onMounted still needed with data persistence update?
 * @todo two onmounteds? Refactor, add Toast for password reset token
 * @example
 *  <WelcomeComponent />
 */
import { Search } from "lucide-vue-next";
import { useRoute } from "vue-router";

import { computed, onMounted, ref, unref } from "vue";

import { useAuthService } from "@/composables/useAuthService";
import { useDataService } from "@/composables/useDataService";
import { useAppStore } from "@/stores/appStore";
import { useRecipeStore } from "@/stores/recipeStore";
import { useUserStore } from "@/stores/userStore";
import type { Recipe } from "@/types/Recipes.d";
import type { ExposedInWelcomeComponent } from "@/types/componentExposedValues.d";

import AuthComponent from "../auth/AuthComponent.vue";
import CollectionComponent from "../collections/CollectionComponent.vue";
import PublicRecipeDetailsComponent from "./publicRecipeDetails/PublicRecipeDetailsComponent.vue";
import SplashComponent from "./splash/SplashComponent.vue";

const props = defineProps({
  currentTime: {
    type: [Object],
    required: false,
    default: () => new Date()
  }
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
  if (recipeStore.publicRecipesLength === 0) {
    try {
      const publicRecipes = await dataService.getPublicRecipes();
      if (!publicRecipes) throw new Error("No Public Recipes Found");
      recipeStore.setInitialPublicRecipeState(publicRecipes);
    } catch (error) {
      console.log("loading public recipes error: ", error);
    }
  }
  const [ethanFavs, recommended, mealTime, snack, healthy] =
    recipeStore.generatePublicRecipeCollections();
  ethansFavouriteRecipes.value = ethanFavs.value;
  recommendedRecipes.value = recommended.value;
  mealTimeRecipes.value = mealTime.value;
  healthyRecipes.value = healthy.value;
  snackRecipes.value = snack.value;
});
let recipeDetailsOpen = ref(false);
const isAuthModalOpen = computed(() => appStore.isAuthModalOpen);

const currentTime = computed(() => {
  const rawTime = unref(props.currentTime);
  if (rawTime instanceof Date) {
    return rawTime;
  } else {
    console.warn("Invalid currentTime prop. Falling back to new Date.");
    return new Date();
  }
});

const greeting = computed((): string => {
  const displayName = userStore.localUser?.displayName;
  if (displayName) {
    return `Welcome, ${displayName}!`;
  } else {
    return `Welcome!`;
  }
});

const mealTime = computed(() => {
  return determineMealTime(currentTime.value.getHours());
});

function determineMealTime(hours: number) {
  if (hours >= 2 && hours < 10) {
    return "Breakfast";
  } else if (hours >= 10 && hours < 15) {
    return "Lunch";
  } else {
    return "Dinner";
  }
}

function closeRecipeDetails() {
  recipeDetailsOpen.value = false;
  recipeStore.clearSelectedRecipeId();
}

defineExpose<ExposedInWelcomeComponent>({
  ethansFavouriteRecipes,
  recommendedRecipes,
  mealTimeRecipes,
  healthyRecipes,
  snackRecipes,
  recipeDetailsOpen,
  closeRecipeDetails
});

onMounted(async () => {
  const token = route.query.token as string;
  if (token) {
    try {
      const isValid = await authService.validatePasswordToken(token);
      if (!isValid) throw new Error("Validation Token no longer Valid");
      validToken.value = true;
      appStore.setAuthModalType("set-password");
    } catch (error) {
      console.log("passwrod reset token verification error: ", error);
    } finally {
      isLoading.value = false;
    }
  }
});
</script>

<template>
  <div class="welcome-container">
    <div v-if="isLoading">... Page is loading</div>
    <div class="guest-welcome" v-if="!userStore.authorized">
      <SplashComponent />
    </div>
    <div class="welcome">
      <h1 class="greeting">{{ greeting }}</h1>
      <h2>What's for Supper?</h2>
      <div class="searchbar">
        <input disabled type="text" class="searchbar-input" placeholder="Burritos" />
        <button disabled><Search class="magnifying" :size="15" /></button>
      </div>
      <span style="font-size: 0.7em">Search and Public Recipe Filtering Coming Soon!</span>
      <div class="base-content-container">
        <CollectionComponent
          ref="recommended-recipes-collection"
          title="Recommended Public Recipes"
          :recipeData="recommendedRecipes"
        />
        <CollectionComponent title="Ethan's Favourites" :recipeData="ethansFavouriteRecipes" />
        <CollectionComponent
          ref="mealtime-collection"
          :title="'Ready for ' + mealTime"
          :recipeData="mealTimeRecipes"
        />
        <CollectionComponent title="Snacks" :recipeData="snackRecipes" />
        <CollectionComponent title="Healthy Foods" :recipeData="healthyRecipes" />
      </div>
    </div>
    <div class="attribute">
      <a href="https://nick-karvounis.com/" target="_blank">Photo by Nick Karvounis on Unsplash</a>
    </div>
  </div>

  <PublicRecipeDetailsComponent
    v-if="recipeStore.selectedRecipeId"
    @closeRecipeDetails="closeRecipeDetails()"
  />
  <AuthComponent v-if="isAuthModalOpen" />
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
  height: 100%
  margin-bottom: 20px

.welcome
  overflow-y: auto

.welcome, .guest-welcome
  display: flex
  align-items: center
  flex-direction: column
  background-color: white
  border-radius: 5px
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
