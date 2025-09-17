/**
 * Handles all Recipe Data related API calls and initilizations
 * @todo - Finish the split from useDataService
 * @returns - saveNewRecipe, updateUserRecipes, updateRecipe, getPublicRecipes, deleteRecipe,  getUserData, error
 * @example
 * const dataService = useDataService();
 * await dataService.saveNewRecipe(recipe);
 */
import { COLLECTION_TAGS } from "@/constants";
import { RecipeCollectionResult } from "@/types/Recipes";
import { getMealTime } from "@/utilities";

import { useDataService } from "./useDataService";

export function useRecipeService() {
  const dataService = useDataService();

  const fetchRecipeCollections = async (): Promise<RecipeCollectionResult[]> => {
    const collectionTags = Object.values(COLLECTION_TAGS);
    const results = await Promise.allSettled(
      collectionTags.map((tags) => fetchOneCollection(tags))
    );

    return results.map((result, index) => ({
      tags: collectionTags[index],
      recipes: result.status === "fulfilled" ? result.value : [],
      error: result.status === "rejected" ? result.reason : null
    }));
  };

  const fetchOneCollection = async (collectionTags: string[]) => {
    // TODO Check getMealTime return.
    const tags = collectionTags.includes("mealTime") ? getMealTime() : collectionTags;

    const collectionResponse = await dataService.getRecipesForCollections(tags);
    return collectionResponse || [];
  };

  return {
    fetchRecipeCollections,
    fetchOneCollection
  };
}
