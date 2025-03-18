import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RecipeServices } from './recipe.service';

const createRecipe = catchAsync(async (req, res) => {
  const result = await RecipeServices.createRecipeInDB(req.file, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Recipe created successfully',
    data: result,
  });
});

const getSingleRecipe = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await RecipeServices.getSingleRecipeFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Recipe retrieved successfully',
    data: result,
  });
});

const getAllRecipes = catchAsync(async (req, res) => {
  const result = await RecipeServices.getAllRecipesFromDB(req?.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Recipes retrieved successfully',
    data: result,
  });
});

const getAllRecipesNameAndId = catchAsync(async (req, res) => {
  const result = await RecipeServices.getAllRecipesNameAndIdFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Recipes name and id retrieved successfully',
    data: result,
  });
});

const updateSingleRecipe = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await RecipeServices.updateRecipeInDB(id, req?.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Recipe updated successfully',
    data: result,
  });
});

const deleteRecipe = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RecipeServices.deleteRecipeInDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Recipes deleted successfully',
    data: result,
  });
});

export const RecipeControllers = {
  createRecipe,
  getSingleRecipe,
  getAllRecipes,
  getAllRecipesNameAndId,
  updateSingleRecipe,
  deleteRecipe,
};
