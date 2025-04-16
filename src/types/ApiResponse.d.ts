import { Recipe } from "./Recipes"
import { LocalUser } from "./UserState"

export type StandardRecipeApiResponse = {
    success: boolean;
    message?: string;
    data?: Recipe;
}

export type StandardUserApiResponse = {
    success: boolean;
    message?: string;
    data?: LocalUser;
}

export type GetUserDataResponse = {
    userData: LocalUser;
    userRecipes: Recipe[];
}