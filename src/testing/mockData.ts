import { computed, ref } from 'vue'
import type { Recipe } from '@/types/Recipes'

export const mockComputedRecipes = computed<Recipe[]>(() => [
  { 
    id: '1', 
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
    id: '2', 
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
      id: '1', 
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
      id: '2', 
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
      id: '3', 
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
      id: '4', 
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
      id: '5', 
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
      id: '6', 
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
      id: '7', 
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
      id: '8', 
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
      id: '9', 
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