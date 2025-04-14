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

const removeMealFromWeek = catchAsync(async (req, res) => {
  const { weekId, mealId } = req.params;
  console.log(weekId, mealId);

  const result = await MealPlanServices.removeMealFromWeekFromDB(
    weekId,
    mealId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully removed meal from week!',
    data: result,
  });
});

const getMealPlanForWeek = catchAsync(async (req, res) => {
  const { week } = req.query;

  const mealPlan = await MealPlanServices.getMealPlanForWeek(week as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Meal plan retrieved successfully!',
    data: mealPlan,
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

const getMonthlyMealPlan = catchAsync(async (req, res) => {
  const MealPlan = await MealPlanServices.getMonthlyMealPlanFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Monthly meal plan retrieved successfully!',
    data: MealPlan,
  });
});

const getCurrentAndLastMonthMealPlans = catchAsync(async (req, res) => {
  const MealPlan =
    await MealPlanServices.getCurrentAndLastMonthMealPlansFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Meal plan weeks retrieved successfully!',
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

const updateWeeklyPlan = catchAsync(async (req, res) => {
  const { id } = req.params; // Get meal plan ID from request params
  const { week, selectedMeals } = req.body; // Get week and selectedMeals from request body

  const result = await MealPlanServices.updateWeeklyPlanInDB(
    id,
    week as string,
    selectedMeals,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Weekly plan updated successfully!',
    data: result,
  });
});

const deleteMealPlan = catchAsync(async (req, res) => {
  const { id } = req.params;

  const MealPlan = await MealPlanServices.deleteMealPlanFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Meal plan deleted successfully!',
    data: MealPlan,
  });
});

const deleteMealPlanForWeek = catchAsync(async (req, res) => {
  const { week } = req.query;

  const result = await MealPlanServices.deleteMealPlanForWeek(week as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Deleted weekly personal meals successfully!',
    data: result,
  });
});

export const MealPlanControllers = {
  createMealPlan,
  getAllMealPlan,
  updateMealPlan,
  updateWeeklyPlan,
  deleteMealPlan,
  deleteMealPlanForWeek,
  removeMealFromWeek,
  getMealPlanForWeek,
  getMonthlyMealPlan,
  getCurrentAndLastMonthMealPlans,
};
