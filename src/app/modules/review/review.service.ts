import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import Customer from '../customer/customer.model';
import { Order } from '../order/order.model';
import { hasCustomerPurchasedRecipe } from '../order/order.utils';
import Recipe from '../recipe/recipe.model';
import { IReview } from './review.interface';
import Review from './review.model';

const checkReviewEleigibilityFromDB = async (payload: {
  targetId: Types.ObjectId;
  targetType: 'recipe' | 'provider';
  userId: Types.ObjectId;
}) => {
  const customer = await Customer.findOne({ user: payload.userId });

  if (!customer)
    throw new AppError(403, 'Only customers can leave a recipe review!');

  let eligible = false;
  let alreadyReviewed = false;

  // CHECK IF ALREADY REVIEWED
  const existing = await Review.findOne({
    userId: payload.userId,
    targetId: payload.targetId,
    targetType: payload.targetType,
  });
  alreadyReviewed = !!existing;

  // PURCHASE CHECK
  if (payload.targetType === 'recipe') {
    eligible = await hasCustomerPurchasedRecipe(
      payload.userId,
      payload.targetId,
    );
  } else if (payload.targetType === 'provider') {
    const orders = await Order.find({
      user: payload.userId,
      'meals.status': 'Completed',
    });

    const completedMealIds = orders.flatMap((order) =>
      order.meals
        .filter((meal) => meal.status === 'Completed')
        .map((meal) => meal.meal.toString()),
    );

    const mealFromProvider = await Recipe.findOne({
      _id: { $in: completedMealIds },
      providerId: payload.targetId,
    });

    if (!mealFromProvider)
      throw new AppError(
        403,
        'You can only review a provider you have ordered from.',
      );
  }

  return {
    eligibleToReview: eligible,
    alreadyReviewed,
  };
};

const getAllReviewsForRecipesFromDB = async () => {
  return await Review.find({ targetType: 'recipe' });
};
const getAllReviewsForProvidersFromDB = async () => {
  return await Review.find({ targetType: 'provider' });
};

const createReviewInDB = async (payload: IReview) => {
  const customer = await Customer.findOne({ user: payload.userId });

  if (!customer)
    throw new AppError(403, 'Only customers can leave a recipe review!');

  const hasPurchased = await hasCustomerPurchasedRecipe(
    payload.userId,
    payload.targetId,
  );

  if (payload.targetType === 'recipe') {
    if (!hasPurchased) {
      throw new AppError(403, 'You can only review recipes you have purchased');
    }
  } else if (payload.targetType === 'provider') {
    const orders = await Order.find({
      user: payload.userId,
      'meals.status': 'Completed',
    });

    const completedMealIds = orders.flatMap((order) =>
      order.meals
        .filter((meal) => meal.status === 'Completed')
        .map((meal) => meal.meal.toString()),
    );

    const mealFromProvider = await Recipe.findOne({
      _id: { $in: completedMealIds },
      providerId: payload.targetId,
    });

    if (!mealFromProvider)
      throw new AppError(
        403,
        'You can only review a provider you have ordered from.',
      );
  }

  return await Review.create(payload);
};

const updateReviewInDB = async (
  payload: Partial<IReview>,
  reviewId: string,
) => {
  return await Review.findByIdAndUpdate(reviewId, payload, {
    new: true,
  });
};

const deleteReviewFromDB = async (reviewId: string) => {
  return await Review.findByIdAndDelete(reviewId);
};

export const ReviewServices = {
  checkReviewEleigibilityFromDB,
  createReviewInDB,
  getAllReviewsForRecipesFromDB,
  getAllReviewsForProvidersFromDB,
  updateReviewInDB,
  deleteReviewFromDB,
};
