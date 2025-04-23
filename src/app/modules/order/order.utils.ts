// import { Types } from 'mongoose';
// import { Order } from './order.model';

// export const hasCustomerPurchasedRecipe = async (
//   userId: Types.ObjectId,
//   recipeId: Types.ObjectId,
// ): Promise<boolean> => {
//   const order = await Order.findOne({
//     user: userId,
//     meals: {
//       $elemMatch: {
//         meal: recipeId,
//         status: 'Completed',
//       },
//     },
//   });

//   return !!order;
// };

import { Types } from 'mongoose';
import { Order } from './order.model';
import AppError from '../../errors/AppError';

export const validateRecipeReviewEligibility = async (
  userId: Types.ObjectId,
  recipeId: Types.ObjectId,
) => {
  const orders = await Order.find({
    user: userId,
    'meals.meal': recipeId,
  });

  if (!orders.length) {
    throw new AppError(403, 'You must purchase the recipe to leave a review.');
  }

  // Check if *any* instance of the recipe has a status of 'Completed'
  const hasCompletedMeal = orders.some((order) =>
    order.meals.some(
      (meal) =>
        meal.meal.toString() === recipeId.toString() &&
        meal.status === 'Completed',
    ),
  );

  if (hasCompletedMeal) return true;

  // If it's purchased but all statuses are non-completed, find the exact status to return an appropriate error
  const foundMeal = orders
    .flatMap((order) => order.meals)
    .find((meal) => meal.meal.toString() === recipeId.toString());

  if (!foundMeal) {
    throw new AppError(403, 'Meal not found in your orders.');
  }

  if (foundMeal.status === 'Pending') {
    throw new AppError(
      403,
      'You cannot review this meal until it is completed.',
    );
  }

  if (foundMeal.status === 'Cancelled') {
    throw new AppError(403, 'You cannot review a cancelled meal.');
  }

  throw new AppError(403, 'Invalid meal status.');
};
