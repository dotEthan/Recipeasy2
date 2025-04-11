import { Recipe } from "./Recipes"

export type SaveRecipeResponse = {
    response: {
        success: boolean,
        message?: string,
        data?: Recipe
    }
}