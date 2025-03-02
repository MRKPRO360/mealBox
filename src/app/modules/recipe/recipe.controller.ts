import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RecipeServices } from './recipe.service';

const createRecipe = catchAsync(async (req, res) => {
  const result = await RecipeServices.createRecipeInDB(req.file, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Customer created successfully',
    data: result,
  });
});

export const RecipeController = {
  createRecipe,
};
