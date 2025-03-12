import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MealPlanServices } from './mealPlan.service';

const createMealPlan = catchAsync(async (req, res) => {
  const MealPlan = await MealPlanServices.createMealPlanInDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Meal plan created successfully!',
    data: MealPlan,
  });
});
const getAllMealPlan = catchAsync(async (req, res) => {
  const MealPlan = await MealPlanServices.getAllMealPlansFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Meal plan retrieved successfully!',
    data: MealPlan,
  });
});
const updateMealPlan = catchAsync(async (req, res) => {
  const { id } = req.params;

  const MealPlan = await MealPlanServices.updateSingleMealPlanFromDB(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Meal plan updated successfully!',
    data: MealPlan,
  });
});

const deleteMealPlan = catchAsync(async (req, res) => {
  const { id } = req.params;

  const MealPlan = await MealPlanServices.deleteMenuFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Meal plan deleted successfully!',
    data: MealPlan,
  });
});

export const MealPlanControllers = {
  createMealPlan,
  getAllMealPlan,
  updateMealPlan,
  deleteMealPlan,
};
