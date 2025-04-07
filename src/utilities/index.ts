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

export function setRecipeStructure(recipes: any[], userId: ObjectId) {
  const newRecipeArray: any[] = [];
  console.log('starting alterer: ', recipes)
  for (const recipe of recipes) {
    let mealType;
    if (Array.isArray(recipe.mealType)) {
      mealType = recipe.mealType
    } else if (!recipe.mealType) {
      mealType = [];
    } else {
      mealType = [recipe.mealType];
    }
    const newRecipe = {
      name: recipe.name,
      description: recipe.description || '',
      imgPath: recipe.imgPath || '',
      info: {
        mealType: mealType,
        cuisineType: recipe.cuisineType,
        cookTime: {
          value: recipe.cookTime || '30',
          unit: 'minutes'
        },
        prepTime: {
          value: recipe.prepTime || '30',
          unit: 'minutes'
        },
        servingSize: recipe.servingSize,
        nutritionalInfo: recipe.nutritionalInformation
      },
      ratings: {
          ratings: [],
          averageRating: 0,
          totalRatings: 0,
          ratingsSum: 0
      },
      url: recipe.url,
      ingredients: recipe.ingredients || [],
      directions: recipe.directions || [],
      visibility: 'public',
      tags: recipe.tags || [],
      notes: recipe.notes || [],
      userId: new ObjectId(userId),
      metaData: {
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
    newRecipeArray.push(newRecipe);
    console.log('in alterer: ', newRecipeArray)
  }
  
  return newRecipeArray;
}