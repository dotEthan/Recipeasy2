import { defineStore } from 'pinia'
import type { Recipe } from '@/types/Recipes'

export const UseRecipeStore = defineStore('recipes', {
  state: () => ({
    userId: '1', // UUID
    recipes: [
      {
        id: 1,
        name: 'Beyond Burger',
        description: 'A burger Beyond Burgers of Burger Beyondness',
        ingredients: [
          {
            title: 'Cake',
            steps: [
              { name: 'stuff', amount: '3', unit: 'cups' },
              { name: 'things' },
              { name: 'etc' }
            ]
          }
        ],
        directions: [{ title: 'do first', steps: ['stir it', 'mix it', 'lick it'] }],
        imgPath: 'https://picsum.photos/seed/picsum/200/300',
        rating: 3.5,
        private: true,
        tags: ['burger', 'snack', 'dinner', 'fast food', 'vegan']
      },
      {
        id: 2,
        name: 'Milkshake',
        ingredients: ['stuff', 'things', 'etc'],
        imgPath:
          'https://assets.epicurious.com/photos/647df8cad9749492c4d5d407/1:1/w_1920,c_limit/StrawberryMilkshake_RECIPE_053123_3599.jpg',
        rating: 3.5,
        tags: ['milk', 'drink', 'fast food', 'vegan']
      },
      {
        id: 3,
        name: 'Fries and Coke',
        ingredients: ['stuff', 'things', 'etc'],
        imgPath: 'https://retailworldmagazine.com.au/wp-content/uploads/2021/06/Beyond_Burger1.jpg',
        rating: 3.5,
        tags: ['potato', 'drink', 'fast food']
      },
      {
        id: 4,
        name: 'naps',
        ingredients: ['stuff', 'things', 'etc'],
        imgPath: 'https://retailworldmagazine.com.au/wp-content/uploads/2021/06/Beyond_Burger1.jpg',
        rating: 3.5,
        tags: ['beets', 'drink', 'fast food', 'vegan']
      },
      {
        id: 5,
        name: 'relapse',
        ingredients: ['stuff', 'things', 'etc'],
        imgPath: 'https://retailworldmagazine.com.au/wp-content/uploads/2021/06/Beyond_Burger1.jpg',
        rating: 3.5,
        tags: ['milk', 'drink', 'fast food', 'vegan']
      }
    ] as Recipe[],
    selectedRecipeId: 0,
    activeFilters: [] as String[]
  }),
  getters: {
    recipeLength: (state) => state.recipes.length,
    getSelectedRecipe: (state) =>
      state.recipes.find((recipe) => recipe.id === state.selectedRecipeId),
    getAllRecipeTags: (state) =>
      Array.from(
        new Set(
          state.recipes.flatMap(
            (recipe) => recipe.tags?.filter((tag): tag is string => typeof tag === 'string') || []
          )
        )
      ),
    getActiveFilters: (state) => state.activeFilters
  },
  actions: {
    setSelectedRecipeId(id: number) {
      this.selectedRecipeId = id
    },
    removeSelectedRecipe() {
      const recipeToDelete = this.recipes.find((recipe) => recipe.id === this.selectedRecipeId)
      const deletedRecipeIndex = recipeToDelete ? this.recipes.indexOf(recipeToDelete) : -1
      if (deletedRecipeIndex) {
        this.recipes.splice(deletedRecipeIndex, 1)
      } else {
        console.log('recipe does not exist')
      }
    },
    setActiveFilters(filters: string[]) {
      this.activeFilters = filters
    },
    setRecipes(recipes: Recipe[]) {
      this.recipes = recipes
    }
  }
})
