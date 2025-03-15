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
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Personal meal plan retrieved successfully!',
    data: result,
  });
});

const getAllPersonalMealPlan = catchAsync(async (req, res) => {
  const result = await PersonalMealPlanServices.getAllPersonalMealPlansFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Personal meal plan retrieved successfully!',
    data: result,
  });
});

const getMonthlyPersonalMealPlan = catchAsync(async (req, res) => {
  const result =
    await PersonalMealPlanServices.getMonthlyPersonalMealPlanFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Monthly personal meal plan retrieved successfully!',
    data: result,
  });
});

const getCurrentAndLastMonthPersonalMealPlans = catchAsync(async (req, res) => {
  const result =
    await PersonalMealPlanServices.getCurrentAndLastMonthPersonalMealPlansFromDB();

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

  const result =
    await PersonalMealPlanServices.deletePersonalMealPlanFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Personal meal plan deleted successfully!',
    data: result,
  });
});

export const PersonalMealPlanControllers = {
  createPersonalMealPlan,
  getAllPersonalMealPlan,
  updatePersonalMealPlan,
  deletePersonalMealPlan,
  getPersonalMealPlanForWeek,
  getMonthlyPersonalMealPlan,
  getCurrentAndLastMonthPersonalMealPlans,
};
