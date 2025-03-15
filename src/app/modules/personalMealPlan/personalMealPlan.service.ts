/* eslint-disable @typescript-eslint/no-explicit-any */

import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import Recipe from '../recipe/recipe.model';
import { IPersonalMealPlan } from './personalMealPlan.interface';
import PersonalMealPlan from './personalMealPlan.model';

const createPersonalMealPlanInDB = async (
  payload: IPersonalMealPlan,
  user: JwtPayload,
) => {
  const mealIds = payload.selectedMeals;

  // Step 1: Check if all meal IDs are valid (exist in the Recipe collection)
  const validMeals = await Recipe.find({ _id: { $in: mealIds } });

  // If the number of valid meals doesn't match the number of provided meals, there's an invalid ID
  if (validMeals.length !== mealIds.length) {
    throw new AppError(400, 'One or more meal IDs are invalid');
  }

  // Step 2: Validate the date (Only allow 7, 14, 21, 28)
  const newWeek = new Date(payload.week);
  const allowedDates = [7, 14, 21, 28];

  if (!allowedDates.includes(newWeek.getDate())) {
    throw new AppError(
      400,
      'Meal plans can only be created for the 7th, 14th, 21st, or 28th of the month.',
    );
  }

  // Find the most recent meal plan
  const latestMealPlan = await PersonalMealPlan.findOne().sort({ week: -1 });

  if (latestMealPlan) {
    // Calculate the difference in days
    const lastWeek = new Date(latestMealPlan.week);
    const newWeek = new Date(payload.week);
    const diffInDays =
      (newWeek.getTime() - lastWeek.getTime()) / (1000 * 60 * 60 * 24);

    // Validate the difference should be exactly 7 days
    if (diffInDays !== 7) {
      throw new AppError(
        400,
        'Each meal plan week should be exactly 7 days apart.',
      );
    }
  }

  return await PersonalMealPlan.create({ ...payload, customer: user });
};

const getPersonalMealPlanForWeek = async (week: string) => {
  if (!week) new AppError(400, 'Week is not provided');

  return await PersonalMealPlan.findOne({ week }).populate('selectedMeals');
};

const getMonthlyPersonalMealPlanFromDB = async () => {
  const currentMonth = new Date().getMonth() + 1; // Get current month (1-based index)
  const mealPlans =
    await PersonalMealPlanServices.getAllPersonalMealPlansFromDB();

  // Filter only the meal plans in the current month
  const filteredPlans = mealPlans.filter((plan) => {
    const planMonth = new Date(plan.week).getMonth() + 1; // Convert week date to month
    return planMonth === currentMonth;
  });

  return filteredPlans;
};

const getAllPersonalMealPlansFromDB = async () => {
  return await PersonalMealPlan.find({}).populate('selectedMeals');
};

const getCurrentAndLastMonthPersonalMealPlansFromDB = async () => {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-based index (March = 2)
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January case
  const currentYear = today.getFullYear();
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear; // Handle December case

  const mealPlans = await PersonalMealPlan.find({
    $or: [
      {
        week: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
      {
        week: {
          $gte: new Date(lastMonthYear, lastMonth, 1),
          $lt: new Date(lastMonthYear, lastMonth + 1, 1),
        },
      },
    ],
  }).sort({ week: 1 }); // Sorting by week in ascending order

  return mealPlans;
};

const updateSinglePersonalMealPlanFromDB = async (
  id: string,
  payload: Partial<IPersonalMealPlan>,
) => {
  return await PersonalMealPlan.findByIdAndUpdate(id, payload);
};
const deletePersonalMealPlanFromDB = async (id: string) => {
  return await PersonalMealPlan.findByIdAndUpdate(id, {
    isDeleted: true,
  });
};

export const PersonalMealPlanServices = {
  createPersonalMealPlanInDB,
  getAllPersonalMealPlansFromDB,
  getCurrentAndLastMonthPersonalMealPlansFromDB,
  updateSinglePersonalMealPlanFromDB,
  deletePersonalMealPlanFromDB,
  getPersonalMealPlanForWeek,
  getMonthlyPersonalMealPlanFromDB,
};
