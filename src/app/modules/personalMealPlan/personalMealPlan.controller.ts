import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PersonalMealPlanServices } from './personalMealPlan.service';

const createPersonalMealPlan = catchAsync(async (req, res) => {
  const result = await PersonalMealPlanServices.createPersonalMealPlanInDB(
    req.body,
    req.user!,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Personal meal plan created successfully!',
    data: result,
  });
});

const getPersonalMealPlanForWeek = catchAsync(async (req, res) => {
  const { week } = req.query;

  const result = await PersonalMealPlanServices.getPersonalMealPlanForWeek(
    week as string,
    req.user!,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Personal meal plan retrieved successfully!',
    data: result,
  });
});

const deletePersonalMealPlanForWeek = catchAsync(async (req, res) => {
  const { week } = req.query;

  const result = await PersonalMealPlanServices.deletePersonalMealPlanForWeek(
    week as string,
    req.user!,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Deleted weekly personal meals successfully!',
    data: result,
  });
});

const updateWeeklyPlan = catchAsync(async (req, res) => {
  const { id } = req.params; // Get meal plan ID from request params
  const { week, selectedMeals } = req.body; // Get week and selectedMeals from request body

  const result = await PersonalMealPlanServices.updateWeeklyPlanInDB(
    id,
    week as string,
    selectedMeals,
    req.user!,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Weekly plan updated successfully!',
    data: result,
  });
});

const getAllPersonalMealPlan = catchAsync(async (req, res) => {
  const result = await PersonalMealPlanServices.getAllPersonalMealPlansFromDB(
    req.user!,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Personal meal plan retrieved successfully!',
    data: result,
  });
});

const getMonthlyPersonalMealPlan = catchAsync(async (req, res) => {
  const result =
    await PersonalMealPlanServices.getMonthlyPersonalMealPlanFromDB(req.user!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Monthly personal meal plan retrieved successfully!',
    data: result,
  });
});

const getCurrentAndLastMonthPersonalMealPlans = catchAsync(async (req, res) => {
  const result =
    await PersonalMealPlanServices.getCurrentAndLastMonthPersonalMealPlansFromDB(
      req.user!,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Personal meal plan weeks retrieved successfully!',
    data: result,
  });
});

const updatePersonalMealPlan = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result =
    await PersonalMealPlanServices.updateSinglePersonalMealPlanFromDB(
      id,
      req.body,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Personal meal plan updated successfully!',
    data: result,
  });
});

const deletePersonalMealPlan = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id);

  const result =
    await PersonalMealPlanServices.deletePersonalMealPlanFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Personal meal plan deleted successfully!',
    data: result,
  });
});

const removeMealFromWeek = catchAsync(async (req, res) => {
  const { weekId, mealId } = req.params;
  console.log(weekId, mealId);

  const result = await PersonalMealPlanServices.removeMealFromWeekFromDB(
    weekId,
    mealId,
    req.user!,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully removed meal from week!',
    data: result,
  });
});

export const PersonalMealPlanControllers = {
  createPersonalMealPlan,
  getAllPersonalMealPlan,
  updatePersonalMealPlan,
  deletePersonalMealPlan,
  deletePersonalMealPlanForWeek,
  removeMealFromWeek,
  getPersonalMealPlanForWeek,
  updateWeeklyPlan,
  getMonthlyPersonalMealPlan,
  getCurrentAndLastMonthPersonalMealPlans,
};
