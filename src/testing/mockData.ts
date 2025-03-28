import { computed, ref } from 'vue'
import type { Recipe } from '@/types/Recipes'

export const mockComputedRecipes = computed<Recipe[]>(() => [
  { 
   _id: '1', 
    name: 'Recipe 1', 
    ingredients: [], 
    directions: [], 
    tags: [],
    nutritionalInfo: [],
    notes:[],
    isPrivate: false,
    creatorId: '1'
  },
  { 
   _id: '2', 
    name: 'Recipe 2', 
    ingredients: [], 
    directions: [], 
    tags: [],
    nutritionalInfo: [],
    notes:[],
    isPrivate: false,
    creatorId: '1'
  }
]);

export const mockRefRecipes = ref<Recipe[]>([
    { 
     _id: '1', 
      name: 'Recipe 1', 
      ingredients: [], 
      directions: [], 
      tags: [],
      nutritionalInfo: [],
      notes:[],
      isPrivate: false,
      creatorId: '1'
    },
    { 
     _id: '2', 
      name: 'Recipe 2', 
      ingredients: [], 
      directions: [], 
      tags: [],
      nutritionalInfo: [],
      notes:[],
      isPrivate: false,
      creatorId: '1'
    },
    { 
     _id: '3', 
      name: 'Recipe 2', 
      ingredients: [], 
      directions: [], 
      tags: [],
      nutritionalInfo: [],
      notes:[],
      isPrivate: false,
      creatorId: '1'
    },
    { 
     _id: '4', 
      name: 'Recipe 2', 
      ingredients: [], 
      directions: [], 
      tags: [],
      nutritionalInfo: [],
      notes:[],
      isPrivate: false,
      creatorId: '1'
    },
    { 
     _id: '5', 
      name: 'Recipe 2', 
      ingredients: [], 
      directions: [], 
      tags: [],
      nutritionalInfo: [],
      notes:[],
      isPrivate: false,
      creatorId: '1'
    },
    { 
     _id: '6', 
      name: 'Recipe 2', 
      ingredients: [], 
      directions: [], 
      tags: [],
    nutritionalInfo: [],
    notes:[],
    isPrivate: false,
    creatorId: '1'
    },
    { 
     _id: '7', 
      name: 'Recipe 2', 
      ingredients: [], 
      directions: [], 
      tags: [],
    nutritionalInfo: [],
    notes:[],
    isPrivate: false,
    creatorId: '1'
    },
    { 
     _id: '8', 
      name: 'Recipe 2', 
      ingredients: [], 
      directions: [], 
      tags: [],
    nutritionalInfo: [],
    notes:[],
    isPrivate: false,
    creatorId: '1'
    },
    { 
     _id: '9', 
      name: 'Recipe 2', 
      ingredients: [], 
      directions: [], 
      tags: [],
    nutritionalInfo: [],
    notes:[],
    isPrivate: false,
    creatorId: '1'
    }
  ]);