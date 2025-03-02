/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRecipe } from './recipe.interface';
import Recipe from './recipe.model';

export const createRecipeInDB = async (file: any, payload: IRecipe) => {
  return Recipe.create({ ...payload, recipeImage: file?.path || '' });
};

export const RecipeServices = {
  createRecipeInDB,
};
