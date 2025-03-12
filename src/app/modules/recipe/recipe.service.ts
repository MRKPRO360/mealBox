/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builder/QueryBuilder';
import { recipeSearchableFields } from './recipe.constant';
import { IRecipe } from './recipe.interface';
import Recipe from './recipe.model';

// CREATING A RECIPE
const createRecipeInDB = async (file: any, payload: IRecipe) => {
  return await Recipe.create({ ...payload, recipeImage: file?.path || '' });
};

// GETTING A RECIPE
const getSingleRecipeFromDB = async (id: string) => {
  return await Recipe.findById(id).populate('recipeMenuName').lean();
};

// GETTING ALL RECIPES
const getAllRecipesFromDB = async (query: Record<string, unknown>) => {
  const recipeQuery = new QueryBuilder(
    Recipe.find().populate('recipeMenuName').lean(),
    query,
  )
    .search(recipeSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const meta = await recipeQuery.countTotal();
  const result = await recipeQuery.modelQuery;

  return {
    meta,
    result,
  };
};

// UPDATING A RECIPE

const updateRecipeInDB = async (id: string, payload: Partial<IRecipe>) => {
  // ARR of OBJ
  // ingredients, instructions,

  // ARR
  // tags, allergens, utensils
  return await Recipe.findByIdAndUpdate(id, payload, { new: true });
};

// DELETING A RECIPE

const deleteRecipeInDB = async (id: string) => {
  return await Recipe.findByIdAndUpdate(id);
};

export const RecipeServices = {
  createRecipeInDB,
  getSingleRecipeFromDB,
  getAllRecipesFromDB,
  updateRecipeInDB,
  deleteRecipeInDB,
};
