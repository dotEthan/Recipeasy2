import { useUserStore } from "@/stores/user";
import { NewRecipe } from "@/types/Recipes";
import { Visibility } from "@/types/RecipesEnums";
import { ObjectId } from "bson";

export const createSlug = (title: string, id: string, isPublic: boolean) => {

    const urlSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')  // remove any special charaters
      .replace(/\s+/g, '-')          // spaces become dashes
      .slice(0, 15)
      .replace(/-+$/, '');           // remove trailing dashes
  
    const shortId = id.slice(-5);
  
    return (isPublic) ? `${urlSlug}-${shortId}--pub` : `${urlSlug}-${shortId}`;
}

//TODO test other browsers to see if needed. Firefox already throttles
export function debounce(fn: Function, delay: number) {
  let timeoutId: number
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => fn(...args), delay)
  }
}

export function createNewRecipe(): NewRecipe {
  const userStore = useUserStore();
  const userId = userStore.getCurrentUserId;
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
    userId: new ObjectId(userId)
  }
  
  return newRecipe;
}