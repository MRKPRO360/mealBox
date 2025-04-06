/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';
import { recipeSearchableFields } from './recipe.constant';
import { IRecipe } from './recipe.interface';
import Recipe from './recipe.model';
import Provider from '../provider/provider.model';
import AppError from '../../errors/AppError';

// CREATING A RECIPE
const createRecipeInDB = async (file: any, payload: IRecipe) => {
  const provider = await Provider.findOne({ user: payload?.providerId });

  if (!provider) throw new AppError(400, 'No provider found is that id!');

  return await Recipe.create({
    ...payload,
    providerId: provider._id,
    recipeImage: file?.path || '',
  });
};

// GETTING A RECIPE
const getSingleRecipeFromDB = async (id: string) => {
  return await Recipe.findById(id)
    .populate('recipeMenuName')
    .populate({
      path: 'reviews',
      select: 'rating comment userId createdAt',
      populate: {
        path: 'userId',
        select: 'name email',
        populate: {
          path: 'customer',
          select: 'profileImg',
        },
      },
    })
    .lean();
};

// GETTING ALL RECIPES
const getAllRecipesFromDB = async (query: Record<string, unknown>) => {
  const recipeQuery = new QueryBuilder(
    Recipe.find()
      .populate('recipeMenuName')
      .populate({
        path: 'reviews',
        select: 'rating comment userId createdAt',
        populate: {
          path: 'userId',
          select: 'name email',
          populate: {
            path: 'customer',
            select: 'profileImg',
          },
        },
      })
      .lean(),
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

// GETTING ALL RECIPES NAME AND ID
const getAllRecipesNameAndIdFromDB = async () => {
  return await Recipe.find().select('recipeName _id');
};

// GETTING RECIPES BY PROVIDER
const getAllMyRecipesFromDB = async (
  query: Record<string, unknown>,
  user: JwtPayload,
) => {
  const provider = await Provider.findOne({ user: user.id });

  if (!provider) throw new AppError(400, 'No provider found is that id!');

  const recipeQuery = new QueryBuilder(
    Recipe.find({ providerId: provider._id }).populate('recipeMenuName').lean(),
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

const updateRecipeInDB = async (
  id: string,
  payload: Partial<IRecipe>,
  file: any,
) => {
  // ARR of OBJ
  // ingredients, instructions,

  // ARR
  // tags, allergens, utensils
  return await Recipe.findByIdAndUpdate(
    id,
    { ...payload, recipeImage: file?.path || payload.recipeImage },
    { new: true },
  );
};

// DELETING A RECIPE

const deleteRecipeInDB = async (id: string) => {
  return await Recipe.findByIdAndUpdate(id, {
    isDeleted: true,
  });
};

export const RecipeServices = {
  createRecipeInDB,
  getSingleRecipeFromDB,
  getAllRecipesFromDB,
  updateRecipeInDB,
  deleteRecipeInDB,
  getAllRecipesNameAndIdFromDB,
  getAllMyRecipesFromDB,
};
