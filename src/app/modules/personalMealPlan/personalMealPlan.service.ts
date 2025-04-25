/* eslint-disable @typescript-eslint/no-explicit-any */

import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import Recipe from '../recipe/recipe.model';
import { IPersonalMealPlan } from './personalMealPlan.interface';
import PersonalMealPlan from './personalMealPlan.model';
import { IRecipe } from '../recipe/recipe.interface';

const createPersonalMealPlanInDB = async (
  payload: IPersonalMealPlan,
  user: JwtPayload,
) => {
  // Convert incoming week to Bangladesh time (UTC+6)
  const incomingWeekUTC = new Date(payload.week);
  const BD_TIME_OFFSET_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
  const bdWeekDate = new Date(incomingWeekUTC.getTime() + BD_TIME_OFFSET_MS);

  // Step 1: Check if this week already has a meal plan for the user
  const isWeekExist = await PersonalMealPlan.findOne({
    week: bdWeekDate,
    user: user.id,
  });

  if (isWeekExist) {
    throw new AppError(400, 'Meal plan already assigned for this week!');
  }

  // Step 2: Validate meal IDs
  const mealIds = payload.selectedMeals;
  const validMeals = await Recipe.find({ _id: { $in: mealIds } });

  if (validMeals.length !== mealIds.length) {
    throw new AppError(400, 'One or more meal IDs are invalid');
  }

  // Step 3: Validate allowed start dates (1st, 8th, 15th, 22nd)
  const allowedDates = [1, 8, 15, 22];

  if (!allowedDates.includes(bdWeekDate.getDate())) {
    throw new AppError(
      400,
      'Meal plans can only be created for the 1st, 8th, 15th, or 22nd of the month.',
    );
  }

  // Step 4: Check that this week is exactly 7 days apart from the latest meal plan
  const latestMealPlan = await PersonalMealPlan.findOne({ user: user.id }).sort(
    { week: -1 },
  );

  if (latestMealPlan) {
    const lastWeekUTC = new Date(latestMealPlan.week);
    const lastWeekBD = new Date(lastWeekUTC.getTime() + BD_TIME_OFFSET_MS);

    const diffInDays = Math.abs(
      (bdWeekDate.getTime() - lastWeekBD.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays < 6) {
      throw new AppError(
        400,
        'Each meal plan week should be exactly 7 days apart.',
      );
    }
  }

  // Step 5: Create the new meal plan with the BD date as week
  return await PersonalMealPlan.create({
    ...payload,
    week: bdWeekDate,
    user: user.id,
  });
};

const getPersonalMealPlanForWeek = async (week: string, user: JwtPayload) => {
  if (!week) throw new AppError(400, 'Week is not provided');
  console.log(week);

  return await PersonalMealPlan.findOne({
    week,
    user: user.id,
    isDeleted: false,
  }).populate('selectedMeals');
};

const deletePersonalMealPlanForWeek = async (
  week: string,
  user: JwtPayload,
) => {
  if (!week) throw new AppError(400, 'Week is not provided');

  const personalMealPlanForWeek = await PersonalMealPlan.findOneAndUpdate(
    { week, user: user.id },
    {
      isDeleted: true,
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  if (!personalMealPlanForWeek) throw new AppError(404, 'Meal plan not found'); // ✅ Ensure a document is found

  console.log(personalMealPlanForWeek);

  return personalMealPlanForWeek;
};

// SHOULD BE ADDED FOR PROVIDER
const removeMealFromWeekFromDB = async (
  weekId: string,
  mealId: string,
  user: JwtPayload,
) => {
  if (!weekId || !mealId) {
    throw new AppError(400, 'Week ID or Meal ID is missing.');
  }

  const updatedMealPlan = await PersonalMealPlan.findOneAndUpdate(
    { week: weekId, user: user.id }, // Ensure the meal plan belongs to the user
    { $pull: { selectedMeals: mealId } }, // Remove meal from array
    { new: true }, // Return the updated document
  );

  if (!updatedMealPlan)
    throw new AppError(400, 'Meal plan not found or unauthorized.');

  return updatedMealPlan;
};

const updateWeeklyPlanInDB = async (
  mealPlanId: string,
  week: string,
  selectedMeals: IRecipe[],
  user: JwtPayload,
) => {
  // Check if another meal plan already exists with the same week (excluding the current one) MEANS UPDATING OTHER WEEKLY PLAN

  const existingPlan = await PersonalMealPlan.findOne({
    week,
    user: user.id,
    _id: mealPlanId,
  });

  if (!existingPlan)
    throw new AppError(400, 'A meal plan for this week already exists ):');

  const updatedMealPlan = await PersonalMealPlan.findByIdAndUpdate(
    mealPlanId,
    { week, selectedMeals },
    { new: true, runValidators: true },
  );

  if (!updatedMealPlan) {
    throw new AppError(400, 'Meal plan not found ):');
  }

  return updatedMealPlan;
};

const getMonthlyPersonalMealPlanFromDB = async (user: JwtPayload) => {
  const currentMonth = new Date().getMonth() + 1; // Get current month (1-based index)
  const mealPlans =
    await PersonalMealPlanServices.getAllPersonalMealPlansFromDB(user);

  // Filter only the meal plans in the current month
  const filteredPlans = mealPlans.filter((plan) => {
    const planMonth = new Date(plan.week).getMonth() + 1; // Convert week date to month
    return planMonth === currentMonth;
  });

  return filteredPlans;
};

const getAllPersonalMealPlansFromDB = async (user: JwtPayload) => {
  return await PersonalMealPlan.find({
    user: user.id,
  }).populate({
    path: 'selectedMeals',
    match: { isDeleted: false },
  });
};
// CURRENT PREVIOUS AND NEXT MONTH PLAN.
const getCurrentAndLastMonthPersonalMealPlansFromDB = async (
  user: JwtPayload,
) => {
  const today = new Date();
  const currentMonth = today.getMonth(); // April = 3
  const currentYear = today.getFullYear(); // 2025

  // Previous month
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Next month
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const mealPlans = await PersonalMealPlan.find({
    user: user.id,
    $or: [
      {
        week: {
          $gte: new Date(prevMonthYear, prevMonth, 1),
          $lt: new Date(prevMonthYear, prevMonth + 1, 1),
        },
      },
      {
        week: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
      {
        week: {
          $gte: new Date(nextMonthYear, nextMonth, 1),
          $lt: new Date(nextMonthYear, nextMonth + 1, 1),
        },
      },
    ],
  }).sort({ week: 1 });

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
  deletePersonalMealPlanForWeek,
  removeMealFromWeekFromDB,
  updateWeeklyPlanInDB,
  getPersonalMealPlanForWeek,
  getMonthlyPersonalMealPlanFromDB,
};
