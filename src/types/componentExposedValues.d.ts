import { Ref } from "vue";

import type { Recipe } from "./Recipes.d";

export type ExposedInWelcomeComponent = {
  ethansFavouriteRecipes: Ref<Recipe[]>;
  recommendedRecipes: Ref<Recipe[]>;
  mealTimeRecipes: Ref<Recipe[]>;
  healthyRecipes: Ref<Recipe[]>;
  snackRecipes: Ref<Recipe[]>;
  recipeDetailsOpen: Ref<boolean>;

  closeRecipeDetails: () => void;
};
