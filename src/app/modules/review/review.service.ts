import { IReview } from './review.interface';
import Review from './review.model';

const getAllReviewsForRecipesFromDB = async () => {
  return await Review.find({ targetType: 'recipe' });
};
const getAllReviewsForProvidersFromDB = async () => {
  return await Review.find({ targetType: 'provider' });
};

const createReviewInDB = async (payload: IReview) => {
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
