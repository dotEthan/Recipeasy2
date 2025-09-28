<script setup lang="ts">
/**
 * Component to display Welcome page for all users
 * @todo authcomponent & public recipe details here?
 * @todo Redesign as View
 * @todo onMounted still needed with data persistence update?
 * @todo two onmounteds? Refactor, add Toast for password reset token
 * @example
 *  <WelcomeComponent />
 */
import { Search } from "lucide-vue-next";
import { useRoute } from "vue-router";

import { computed, onMounted, ref } from "vue";

import { useAuthService } from "@/composables/useAuthService";
import { useScreenSizeService } from "@/composables/useScreenSizeService";
import { useAppStore } from "@/stores/appStore";
import { useRecipeStore } from "@/stores/recipeStore";
import { useUserStore } from "@/stores/userStore";

// import type { ExposedInWelcomeComponent } from "@/types/componentExposedValues.d";

import AuthComponent from "../auth/AuthComponent.vue";
import CollectionComponent from "../collections/CollectionComponent.vue";
import ButtonComponent from "../shared/button/ButtonComponent.vue";
import PublicRecipeDetailsComponent from "./publicRecipeDetails/PublicRecipeDetailsComponent.vue";
import SplashComponent from "./splash/SplashComponent.vue";

const appStore = useAppStore();
const userStore = useUserStore();
const recipeStore = useRecipeStore();
const authService = useAuthService();
const screenSizeService = useScreenSizeService();

const route = useRoute();
const validToken = ref(false);
const isLoading = ref(false);
const isMobile = screenSizeService.isMobile;

let recipeDetailsOpen = ref(false);
const isAuthModalOpen = computed(() => appStore.isAuthModalOpen);
const displayName = userStore.getCurrentUserDisplayName;
function closeRecipeDetails() {
  recipeDetailsOpen.value = false;
  recipeStore.clearSelectedRecipeId();
}

function onClick() {
  console.log("click");
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
  <div class="bg-primary max-w-[1500px] w-full">
    <div v-if="isLoading">... Page is loading</div>
    <div v-if="!userStore.authorized">
      <SplashComponent />
    </div>
    <div class="flex flex-col items-center">
      <div class="mt-5 mb-10">
        <h1 class="text-center" v-if="displayName">Welcome {{ displayName }}!</h1>
        <h2 class="text-2xl md:text-4xl text-center">What do you want to eat today?</h2>
      </div>
      <div class="search_container w-full flex flex-col items-center">
        <div class="relative flex w-[80%] md:w-[70%] lg:w-[60%] max-w-[800px] mt-5 searchbar">
          <input
            disabled
            type="text"
            class="searchbar-input outline-accent border-1 border-solid"
            placeholder="Burritos" />
          <button disabled><Search class="magnifying" :size="15" /></button>
          <div
            class="search_disabled_warning absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 p-2 md:p-4 w-[50vw] sm:w-[40vw] md:w-[50vw] lg:w-[30vw] max-w-[380px] bg-accent opacity-90 rounded-md text-[var(--color-dark-navy)] text-center">
            Search and Recipe Filtering Coming Soon!
          </div>
        </div>
        <div class="flex flex-col items-center w-[70%] md:w-[60%] mt-10 max-w-[500px]">
          <span>Search Suggestions:</span>
          <div class="flex flex-row justify-around w-full mt-3 mb-5">
            <div>
              <ButtonComponent @click="onClick" label="Highest Rated Recipes" size="md" />
            </div>
            <div v-if="!isMobile">
              <ButtonComponent @click="onClick" label="Newest Recipes" size="md" />
            </div>
            <div>
              <ButtonComponent @click="onClick" label="Plant Based Desserts" size="md" />
            </div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <div class="w-[90%] mx-auto">
          <CollectionComponent
            v-for="(collection, index) in recipeStore.recipeCollections"
            :key="collection.id"
            :ref="collection.id"
            :collectionKey="index"
            :title="collection.title"
            :recipeData="collection.recipes"
            :loading="collection.loading"
            :error="collection.error" />
        </div>
      </div>
    </div>
  </div>

  <PublicRecipeDetailsComponent
    v-if="recipeStore.selectedRecipeId"
    @closeRecipeDetails="closeRecipeDetails()" />
  <AuthComponent v-if="isAuthModalOpen" />
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *
.searchContainer:hover .search_disabled_warning
  display: absolute
// .welcome-container
//   display: flex
//   align-items: center
//   flex-direction: column
//   height: calc(95vh - $navbar-height)
//   width: 95vw
//   overflow-y: auto

//   @media (min-width: 768px)
//     max-width: 1366px

// .guest-welcome
//   height: 100%
//   margin-bottom: 20px


.searchbar

  .searchbar-input
    line-height: 1.5em
    vertical-align: middle
    flex-grow: 1

    @media (min-width: 768px)
      // line-height: 2em

  button
    margin-left: 10px
    line-height: 1.5em
    vertical-align: middle
    padding: 5px
    // height: 24px
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
