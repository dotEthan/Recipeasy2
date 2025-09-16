import { CACHED_DATA_TTL } from "@/constants";

/**
 * Load data and turn in object for usage=
 * @returns Object with all cached Data.
 */
export const loadCachedData = () => ({
  localUser: getNonExpiredCachedData("localUser-cached"),
  userRecipes: getNonExpiredCachedData("userRecipes-cached"),
  allTags: getNonExpiredCachedData("allTags-cached"),
  recipeCollections: getNonExpiredCachedData("recipeCollections-cached"),
  shoppingLists: getNonExpiredCachedData("shoppingLists-cached"),
  selectedRecipeId: getNonExpiredCachedData("selectedRecipeId-cached") ?? undefined,
  editSelectedRecipe: getNonExpiredCachedData("editSelectedRecipe-cached") === "true" || false
});

/**
 * Check if the cached data is expired and return if fresh
 * @param key - string that is used to store the data in sessionStorage
 * @returns data || null - either the cached data or null if the data is expired
 */
export const getNonExpiredCachedData = (key: string) => {
  const item = sessionStorage.getItem(key);
  if (!item) return null;
  const { data, cachedAt } = JSON.parse(item);
  return Date.now() - cachedAt < CACHED_DATA_TTL ? data : null;
};

/**
 * Format data to be cached to add cachedAt time to ensure freshness
 * @param value - Data to be cached
 * @returns JSON stringified data
 */
export const formatCachedValue = (value: unknown) => {
  return JSON.stringify({ data: value, cachedAt: Date.now() });
};

/**
 * Clears all cached Data except for publicly available recipes for front page
 * @returns void
 */
export const clearAllCachesExceptCollections = () => {
  const storedKeys = Object.keys(sessionStorage);
  storedKeys.forEach((key) => {
    if (key !== "recipeCollections-cached") {
      sessionStorage.removeItem(key);
    }
  });
};
