/* eslint-disable @typescript-eslint/no-explicit-any */

import AppError from '../../errors/AppError';
import { IRecipe } from '../recipe/recipe.interface';
import Recipe from '../recipe/recipe.model';
import { IMealPlan } from './mealPlan.interface';
import MealPlan from './mealPlan.model';

// const createMealPlanInDB = async (payload: IMealPlan) => {
//   // CHECK IF THERE's ANY WEEK PREVIOUSLY ASSIGNED!
//   const isWeekExist = await MealPlan.findOne({ week: payload.week });

//   if (isWeekExist)
//     throw new AppError(400, 'Meal plan already assigned for this week!');

//   const mealIds = payload.selectedMeals;

//   // Step 1: Check if all meal IDs are valid (exist in the Recipe collection)
//   const validMeals = await Recipe.find({ _id: { $in: mealIds } });

//   // If the number of valid meals doesn't match the number of provided meals, there's an invalid ID
//   if (validMeals.length !== mealIds.length) {
//     throw new AppError(400, 'One or more meal IDs are invalid');
//   }

//   // Step 2: Validate the date (Only allow 7, 14, 21, 28)
//   const newWeek = new Date(payload.week);
//   const allowedDates = [1, 8, 15, 22];

//   if (!allowedDates.includes(newWeek.getDate())) {
//     throw new AppError(
//       400,
//       'Meal plans can only be created for the 1th, 8th, 15st, or 22th of the month.',
//     );
//   }

//   // Find the most recent meal plan
//   const latestMealPlan = await MealPlan.findOne().sort({ week: -1 });

//   if (latestMealPlan) {
//     // Calculate the difference in days
//     const lastWeek = new Date(latestMealPlan.week);
//     const newWeek = new Date(payload.week);
//     const diffInDays =
//       (newWeek.getTime() - lastWeek.getTime()) / (1000 * 60 * 60 * 24);

//     // Validate the difference should be exactly 7 days
//     if (Math.abs(diffInDays) < 6) {
//       throw new AppError(
//         400,
//         'Each meal plan week should be exactly 7 days apart.',
//       );
//     }
//   }

//   return await MealPlan.create(payload);
// };

const createMealPlanInDB = async (payload: IMealPlan) => {
  // Convert incoming week to Bangladesh time (UTC+6)
  const incomingWeekUTC = new Date(payload.week);
  const BD_TIME_OFFSET_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
  const bdWeekDate = new Date(incomingWeekUTC.getTime() + BD_TIME_OFFSET_MS);

  // Step 1: Check if a meal plan already exists for this week
  const isWeekExist = await MealPlan.findOne({ week: bdWeekDate });

  if (isWeekExist) {
    throw new AppError(400, 'Meal plan already assigned for this week!');
  }

  // Step 2: Validate meal IDs
  const mealIds = payload.selectedMeals;
  const validMeals = await Recipe.find({ _id: { $in: mealIds } });

  if (validMeals.length !== mealIds.length) {
    throw new AppError(400, 'One or more meal IDs are invalid');
  }

  // Step 3: Validate allowed start dates
  const allowedDates = [1, 8, 15, 22];

  if (!allowedDates.includes(bdWeekDate.getDate())) {
    throw new AppError(
      400,
      'Meal plans can only be created for the 1st, 8th, 15th, or 22nd of the month.',
    );
  }

  // Step 4: Check that this week is exactly 7 days apart from the latest meal plan
  const latestMealPlan = await MealPlan.findOne().sort({ week: -1 });

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

  // Step 5: Create the new meal plan with the BD date
  return await MealPlan.create({
    ...payload,
    week: bdWeekDate,
  });
};

const getMealPlanForWeek = async (week: string) => {
  if (!week) new AppError(400, 'Week is not provided');

  return await MealPlan.findOne({ week }).populate('selectedMeals');
};

const getMonthlyMealPlanFromDB = async () => {
  const currentMonth = new Date().getMonth() + 1; // Get current month (1-based index)
  const mealPlans = await MealPlanServices.getAllMealPlansFromDB();

  // Filter only the meal plans in the current month
  const filteredPlans = mealPlans.filter((plan) => {
    const planMonth = new Date(plan.week).getMonth() + 1; // Convert week date to month
    return planMonth === currentMonth;
  });

  return filteredPlans;
};

const getAllMealPlansFromDB = async () => {
  return await MealPlan.find({}).populate('selectedMeals');
};

const getCurrentAndLastMonthMealPlansFromDB = async () => {
  // const today = new Date();
  // const currentMonth = today.getMonth(); // 0-based index (March = 2)
  // const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January case
  // const currentYear = today.getFullYear();
  // const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear; // Handle December case

  // const mealPlans = await MealPlan.find({
  //   $or: [
  //     {
  //       week: {
  //         $gte: new Date(currentYear, currentMonth, 1),
  //         $lt: new Date(currentYear, currentMonth + 1, 1),
  //       },
  //     },
  //     {
  //       week: {
  //         $gte: new Date(lastMonthYear, lastMonth, 1),
  //         $lt: new Date(lastMonthYear, lastMonth + 1, 1),
  //       },
  //     },
  //   ],
  // }).sort({ week: 1 }); // Sorting by week in ascending order

  // return mealPlans;

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Last month
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Next month
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const mealPlans = await MealPlan.find({
    $or: [
      {
        week: {
          $gte: new Date(lastMonthYear, lastMonth, 1),
          $lt: new Date(lastMonthYear, lastMonth + 1, 1),
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

const removeMealFromWeekFromDB = async (weekId: string, mealId: string) => {
  if (!weekId || !mealId) {
    throw new AppError(400, 'Week ID or Meal ID is missing.');
  }

  const updatedMealPlan = await MealPlan.findOneAndUpdate(
    { week: weekId }, // Ensure the meal plan belongs to the user
    { $pull: { selectedMeals: mealId } }, // Remove meal from array
    { new: true }, // Return the updated document
  );

  if (!updatedMealPlan)
    throw new AppError(400, 'Meal plan not found or unauthorized.');

  return updatedMealPlan;
};

const deleteMealPlanForWeek = async (week: string) => {
  if (!week) throw new AppError(400, 'Week is not provided');

  const personalMealPlanForWeek = await MealPlan.findOneAndUpdate(
    { week },
    {
      isDeleted: true,
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  if (!personalMealPlanForWeek) throw new AppError(404, 'Meal plan not found'); // ✅ Ensure a document is found
  return personalMealPlanForWeek;
};

const updateSingleMealPlanFromDB = async (
  id: string,
  payload: Partial<IMealPlan>,
) => {
  return await MealPlan.findByIdAndUpdate(id, payload);
};
const deleteMealPlanFromDB = async (id: string) => {
  if (!id) throw new AppError(400, 'Week is not provided');

  return await MealPlan.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();
};

const updateWeeklyPlanInDB = async (
  mealPlanId: string,
  week: string,
  selectedMeals: IRecipe[],
) => {
  // Check if another meal plan already exists with the same week (excluding the current one) MEANS UPDATING OTHER WEEKLY PLAN

  const existingPlan = await MealPlan.findOne({
    week,
    _id: mealPlanId,
  });

  if (!existingPlan)
    throw new AppError(400, 'A meal plan for this week already exists ):');

  const updatedMealPlan = await MealPlan.findByIdAndUpdate(
    mealPlanId,
    { week, selectedMeals },
    { new: true, runValidators: true },
  );

  if (!updatedMealPlan) {
    throw new AppError(400, 'Meal plan not found ):');
  }

  return updatedMealPlan;
};

export const MealPlanServices = {
  createMealPlanInDB,
  removeMealFromWeekFromDB,
  getAllMealPlansFromDB,
  getCurrentAndLastMonthMealPlansFromDB,
  updateSingleMealPlanFromDB,
  updateWeeklyPlanInDB,
  deleteMealPlanFromDB,
  deleteMealPlanForWeek,
  getMealPlanForWeek,
  getMonthlyMealPlanFromDB,
};
