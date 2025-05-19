import { useUserStore } from "@/stores/userStore";
import { NewRecipe } from "@/types/Recipes";
import { Visibility } from "@/types/RecipesEnums";

/**
 * Create URL slug out of recipe's title and id slice
 * TODO for use when recipe routing by URL enabled
 * @param {string} - recipe title
 * @param {string} - recipe id
 * @returns {string} - URL slug for that recipe - eg. 'baked-potato-1234'
 * @example
* import { createSlug } from '/utilities';
  * createSlug('baked potatoe', '1234');
  */
export const createSlug = (title: string, id: string) => {

    const urlSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')  // remove any special charaters
      .replace(/\s+/g, '-')          // spaces become dashes
      .slice(0, 15)
      .replace(/-+$/, '');           // remove trailing dashes
  
    const shortId = id.slice(-5);
  
    return `${urlSlug}-${shortId}`;
}

/**
 * Debounce calls by *delay*
 * @param {Function} - function to call 
 * @returns {number} - delay between calls
 * @example
* import { debounce } from '/utilities';
  * debounce(saveUserData(), 500);
  */
export function debounce(fn: Function, delay: number) {
  let timeoutId: number
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => fn(...args), delay)
  }
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
  const userId = userStore.getCurrentUserId || '';
  const newRecipe = {
    name: '',
    description: '',
    imgPath: '',
    url: '',
    ratings: {
        ratings: [],
        averageRating: 0,
        totalRatings: 0,
        ratingsSum: 0
    },
    ingredients: [],
    directions:  [],
    info: {},
    notes: [],
    visibility: Visibility.Public,
    tags: [],
    userId: userId
  }
  
  return newRecipe;
}

/**
 * Get sessionStorage values by key - Data Persistence
 * @param {string} - key name to get value of
 * @returns {<T>} - The object you asked for
 * @example
* import { getSessionData } from '/utilities';
  * getSessionData<UserCachedData>('userData');
  */
export const getSessionData = <T>(key: string): T | null => {  
  const data = sessionStorage.getItem(key);  
  return data ? JSON.parse(data) : null;  
};  

/**
 * Set sessionStorage values - Data Persistence
 * @param {string} - key name to get value of
 * @param {unknown} - Data to be saved
 * @returns {} - Nothing
 * @example
* import { setSessionData } from '/utilities';
 * setSessionData('userData', userDataObject);
 */
export const setSessionData = (key: string, data: unknown) => {  
  sessionStorage.setItem(key, JSON.stringify(data));  
};  

/**
 * Clear sessionStorage values - Data Persistence
 * @param {string} - key name to get value of
 * @returns {} - Nothing
 * @example
* import { clearSessionData } from '/utilities';
 * clearSessionData('userData';
 */
export const clearSessionData = (key: string) => { 
  console.log('clearing:', key) 
  sessionStorage.removeItem(key);  
};  

/**
 * Checks Data expiration
 * @todo still needed or dupe of checkIfCacheExpired
 * @param {number} - Maximum age the data can be (miliseconds)
 * @param {data to check} - Maximum age the data can be (miliseconds)
 * @returns {boolean} - A boolean representing whether the data is expired
 * @example
* import { isDataExpired } from '/utilities';
 * isDataExpired('userData';
 */
export const isCacheExpired = (expiresAt: number) => { 
  const now = new Date();
  const expiryDate = new Date(expiresAt);
  return now >= expiryDate;
};  

/**
 * Extracts public_id from Cloudinary URL
 * @param url - The Cloudinary URL
 * @returns string - The public_id of the image
 */
export const getPublicIdFromUrl = (url: string): string => {
  const matches = url.match(/\/v\d+\/(.+)\.[^.]+$/);
  return matches ? matches[1] : '';
};

/**
 * Check if the cached data is expired
 * @param key - string that is used to store the data in sessionStorage
 * @returns data || null - either the cached data or null if the data is expired
 */
export const checkIfCacheExpired = (key: string) => {
  const item = sessionStorage.getItem(key);
  if (!item) return null;

  const { data, expiresAt } = JSON.parse(item);
  return expiresAt > Date.now() ? data : null;
}

/**
 * Check if the cached data is expired
 * @param key - string that is used to store the data in sessionStorage
 * @returns data || null - either the cached data or null if the data is expired
 */
export const getCachedDataOrFetch = (key: string) => {
  const item = checkIfCacheExpired(key);
  if (item === null) return null;

  const { data, expiresAt } = JSON.parse(item);
  return expiresAt > Date.now() ? data : null;
}

/**
 * Format data to be cached to add cachedAt time to ensure freshness
 * @param value - Data to be cached
 * @returns JSON stringified data
 */
export const formatCachedValue = (value: unknown) => {
  return JSON.stringify({ data: value, cachedAt: Date.now()})
}