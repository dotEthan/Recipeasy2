import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Recipe } from '@/types/Recipes'

export const useRecipeStore = defineStore('recipes', {
  state: () => ({
    userId: '1', // UUID
    recipes: [
      {
        id: 1,
        name: 'Beyond Burger',
        ingredients: [
          { name: 'stuff', amount: '3', unit: 'cups' },
          { name: 'things' },
          { name: 'etc' }
        ],
        imgUrl: 'https://retailworldmagazine.com.au/wp-content/uploads/2021/06/Beyond_Burger1.jpg',
        rating: 3.5,
        private: true,
        tags: ['burger', 'snack', 'dinner', 'fast food']
      },
      {
        id: 2,
        name: 'Milkshake',
        ingredients: ['stuff', 'things', 'etc'],
        imgPath:
          'https://assets.epicurious.com/photos/647df8cad9749492c4d5d407/1:1/w_1920,c_limit/StrawberryMilkshake_RECIPE_053123_3599.jpg',
        rating: 3.5
      },
      {
        id: 3,
        name: 'Fries and Coke',
        ingredients: ['stuff', 'things', 'etc'],
        imgUrl: 'https://retailworldmagazine.com.au/wp-content/uploads/2021/06/Beyond_Burger1.jpg',
        rating: 3.5
      },
      {
        id: 4,
        name: 'naps',
        ingredients: ['stuff', 'things', 'etc'],
        imgUrl: 'https://retailworldmagazine.com.au/wp-content/uploads/2021/06/Beyond_Burger1.jpg',
        rating: 3.5
      },
      {
        id: 5,
        name: 'relapse',
        ingredients: ['stuff', 'things', 'etc'],
        imgUrl: 'https://retailworldmagazine.com.au/wp-content/uploads/2021/06/Beyond_Burger1.jpg',
        rating: 3.5
      }
    ] as Recipe[]
  }),
  getters: {
    recipeLength: (state) => state.recipes.length
  }
})
