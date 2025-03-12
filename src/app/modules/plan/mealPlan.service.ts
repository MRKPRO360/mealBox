/* eslint-disable @typescript-eslint/no-explicit-any */

import { IMealPlan } from './mealPlan.interface';
import MealPlan from './mealPlan.model';

const createMealPlanInDB = async (payload: IMealPlan) => {
  return await MealPlan.create(payload);
};

const getAllMealPlansFromDB = async () => {
  return await MealPlan.find({});
};
const updateSingleMealPlanFromDB = async (
  id: string,
  payload: Partial<IMealPlan>,
) => {
  return await MealPlan.findByIdAndUpdate(id, payload);
};
const deleteMenuFromDB = async (id: string) => {
  return await MealPlan.findByIdAndUpdate(id, {
    isDeleted: true,
  });
};

export const MealPlanServices = {
  createMealPlanInDB,
  getAllMealPlansFromDB,
  updateSingleMealPlanFromDB,
  deleteMenuFromDB,
};
