import AppError from '../../errors/AppError';
import Customer from '../customer/customer.model';
import { Order } from '../order/order.model';
import { hasCustomerPurchasedRecipe } from '../order/order.utils';
import Recipe from '../recipe/recipe.model';
import { IReview } from './review.interface';
import Review from './review.model';

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
  createReviewInDB,
  getAllReviewsForRecipesFromDB,
  getAllReviewsForProvidersFromDB,
  updateReviewInDB,
  deleteReviewFromDB,
};
