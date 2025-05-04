import { computed, ref } from 'vue'
import type { Recipe } from '@/types/Recipes'
import { DurationUnits, Visibility } from '@/types/RecipesEnums';

export const mockComputedRecipes = computed<Recipe[]>(() => [
  { 
   _id: '1', 
    name: 'Recipe 1', 
    description: '',
    imgPath: '',
    info: {
      mealType: [],
      cuisineType: '',
      cookTime: { value: 4, unit: DurationUnits.Hours},
      prepTime: { value: 4, unit: DurationUnits.Hours},
      servingSize: 1,
      nutritionalInfo: []
    },
    ratings: {
       ratings: [],
       averageRating: 0,
       totalRatings: 0,
       ratingsSum: 0
    },
    url: '',
    ingredients: [], 
    directions: [], 
    visibility: Visibility.Public,
    tags: [],
    notes:[],
    userId: ''
  },
  { 
    _id: '2', 
     name: 'Recipe 2', 
     description: '',
     imgPath: '',
     info: {
       mealType: [],
       cuisineType: '',
       cookTime: { value: 4, unit: DurationUnits.Hours},
       prepTime: { value: 4, unit: DurationUnits.Hours},
       servingSize: 1,
       nutritionalInfo: []
     },
     ratings: {
        ratings: [],
        averageRating: 0,
        totalRatings: 0,
        ratingsSum: 0
     },
     url: '',
     ingredients: [], 
     directions: [], 
     visibility: Visibility.Public,
     tags: [],
     notes:[],
     userId: ''
  }
]);

export const mockRefRecipes = ref<Recipe[]>([
  { 
   _id: '1', 
    name: 'Recipe 1', 
    description: '',
    imgPath: '',
    info: {
      mealType: [],
      cuisineType: '',
      cookTime: { value: 4, unit: DurationUnits.Hours},
      prepTime: { value: 4, unit: DurationUnits.Hours},
      servingSize: 1,
      nutritionalInfo: []
    },
    ratings: {
       ratings: [],
       averageRating: 0,
       totalRatings: 0,
       ratingsSum: 0
    },
    url: '',
    ingredients: [], 
    directions: [], 
    visibility: Visibility.Public,
    tags: [],
    notes:[],
    userId: ''
  },
  { 
    _id: '2', 
     name: 'Recipe 2', 
     description: '',
     imgPath: '',
     info: {
       mealType: [],
       cuisineType: '',
       cookTime: { value: 4, unit: DurationUnits.Hours},
       prepTime: { value: 4, unit: DurationUnits.Hours},
       servingSize: 1,
       nutritionalInfo: []
     },
     ratings: {
        ratings: [],
        averageRating: 0,
        totalRatings: 0,
        ratingsSum: 0
     },
     url: '',
     ingredients: [], 
     directions: [], 
     visibility: Visibility.Public,
     tags: [],
     notes:[],
     userId: ''
  }
  ]);