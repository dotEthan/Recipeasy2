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
import { useAppStore } from "@/stores/appStore";
import { useRecipeStore } from "@/stores/recipeStore";
import { useUserStore } from "@/stores/userStore";

// import type { ExposedInWelcomeComponent } from "@/types/componentExposedValues.d";

import AuthComponent from "../auth/AuthComponent.vue";
import CollectionComponent from "../collections/CollectionComponent.vue";
import PublicRecipeDetailsComponent from "./publicRecipeDetails/PublicRecipeDetailsComponent.vue";
import SplashComponent from "./splash/SplashComponent.vue";

const appStore = useAppStore();
const userStore = useUserStore();
const recipeStore = useRecipeStore();
const authService = useAuthService();

const route = useRoute();
const validToken = ref(false);
const isLoading = ref(false);

// const [ethansFavouriteRecipes, recommendedRecipes, mealTimeRecipes, snackRecipes, healthyRecipes] =
//   recipeStore.generatePublicRecipeCollections;
// console.log("favs: ", recommendedRecipes);
let recipeDetailsOpen = ref(false);
const isAuthModalOpen = computed(() => appStore.isAuthModalOpen);

const greeting = computed((): string => {
  const displayName = userStore.localUser?.displayName;
  if (displayName) {
    return `Welcome, ${displayName}!`;
  } else {
    return `Welcome!`;
  }
});

function closeRecipeDetails() {
  recipeDetailsOpen.value = false;
  recipeStore.clearSelectedRecipeId();
}

// defineExpose<ExposedInWelcomeComponent>({
//   ethansFavouriteRecipes,
//   recommendedRecipes,
//   mealTimeRecipes,
//   healthyRecipes,
//   snackRecipes,
//   recipeDetailsOpen,
//   closeRecipeDetails
// });

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
          v-for="collection in recipeStore.recipeCollections"
          :key="collection.id"
          :ref="collection.id"
          :title="collection.title"
          :recipeData="collection.recipes"
          :loading="collection.loading"
          :error="collection.error" />
        <!-- <CollectionComponent
          ref="recommended-recipes-collection"
          title="Recommended Public Recipes"
          :recipeData="recommendedRecipes" />
        <CollectionComponent title="Ethan's Favourites" :recipeData="ethansFavouriteRecipes" />
        <CollectionComponent
          ref="mealtime-collection"
          :title="'Ready for ' + mealTime"
          :recipeData="mealTimeRecipes" />
        <CollectionComponent title="Snacks" :recipeData="snackRecipes" />
        <CollectionComponent title="Healthy Foods" :recipeData="healthyRecipes" /> -->
      </div>
    </div>
    <div class="attribute">
      <a href="https://nick-karvounis.com/" target="_blank">Photo by Nick Karvounis on Unsplash</a>
    </div>
  </div>

  <PublicRecipeDetailsComponent
    v-if="recipeStore.selectedRecipeId"
    @closeRecipeDetails="closeRecipeDetails()" />
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
