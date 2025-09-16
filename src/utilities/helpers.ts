import { useUserStore } from "@/stores/userStore";
import { MealTime, NewRecipe, Visibility } from "@/types/Recipes.d";

/**
 * Create URL slug out of recipe's title and id slice
 * @todo for use when recipe routing by URL enabled
 * @param {string} - recipe title
 * @param {string} - recipe id
 * @returns {string} - URL slug for that recipe - eg. 'baked-potato-1234'
 * @example
 * import { createSlug } from '/utilities';
 * createSlug('baked potatoe', '1234');
 * returns: baked-potatoe-1234
 */
export const createSlug = (title: string, id: string) => {
  const urlSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove any special charaters
    .replace(/\s+/g, "-") // spaces become dashes
    .slice(0, 15)
    .replace(/-+$/, ""); // remove trailing dashes

  const shortId = id.slice(-5);

  return `${urlSlug}-${shortId}`;
};

/**
 * Debounce calls by *delay*
 * @param {Function} - function to call
 * @returns {number} - delay between calls
 * @example
 * import { debounce } from '/utilities';
 * debounce(saveUserData(), 500);
 */
export function debounce(fn: Function, delay: number) {
  let timeoutId: number;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}

/**
 * Creates new Recipe structure to ensure consistency
 * @param {} - None
 * @returns {<NewRecipe>} - type Recipe without _id
 * @example
 * import { createNewRecipe } from '/utilities';
 * createNewRecipe();
 */
export function createNewRecipe(): NewRecipe {
  const userStore = useUserStore();
  const userId = userStore.getCurrentUserId || "";
  const newRecipe = {
    name: "",
    description: "",
    imgPath: "",
    url: "",
    ratings: {
      ratings: [],
      averageRating: 0,
      totalRatings: 0,
      ratingsSum: 0
    },
    ingredients: [],
    directions: [],
    info: {},
    notes: [],
    visibility: Visibility.Public,
    tags: [],
    userId: userId
  };

  return newRecipe;
}

/**
 * Extracts public_id from Cloudinary URL
 * @param url - The Cloudinary URL
 * @returns string - The public_id of the image
 */
export const getPublicIdFromUrl = (url: string): string => {
  const matches = url.match(/\/v\d+\/(.+)\.[^.]+$/);
  return matches ? matches[1] : "";
};

/**
 * Returns what meal is appropriate for labels, searching, filtering, etc
 * @returns MealTime value as appropriate based on user's time.
 */
export const getMealTime = () => {
  const hour = new Date().getHours();
  if (hour >= 2 && hour < 10) {
    return MealTime.Breakfast;
  } else if (hour >= 10 && hour < 15) {
    return MealTime.Lunch;
  } else {
    return MealTime.Supper;
  }
};
