// review.model.ts
import { Schema, Types, model } from 'mongoose';
import { IReview, ReviewModel, TReviewTargetType } from './review.interface';
import Recipe from '../recipe/recipe.model';
import Provider from '../provider/provider.model';

const reviewSchema = new Schema<IReview, ReviewModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['recipe', 'provider'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true },
);

reviewSchema.statics.calcAvgRatings = async function (
  targetId: Types.ObjectId,
  targetType: TReviewTargetType,
) {
  const stats = await this.aggregate([
    // match
    {
      $match: {
        targetId,
        targetType,
      },
    },
    // group
    {
      $group: {
        _id: '$targetId',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log('STATS', stats);

  const rating = stats[0]?.avgRating?.toFixed(1) || '3';
  const count = stats[0]?.nRating || 0;

  if (stats.length > 0) {
    if (targetType === 'recipe') {
      await Recipe.findByIdAndUpdate(targetId, {
        rating: rating,
        ratingsCount: count,
      });
    } else {
      await Provider.findByIdAndUpdate(targetId, {
        rating: rating,
        ratingsCount: count,
      });
    }
  } else {
    if (targetType === 'recipe') {
      await Recipe.findByIdAndUpdate(targetId, {
        rating: '3', // default rating fallback
        ratingsCount: 0,
      });
    } else {
      await Provider.findByIdAndUpdate(targetId, {
        rating: '3', // default rating fallback
        ratingsCount: 0,
      });
    }
  }
};

// TRIGGERING CALCAVG RATINGS AFTER SAVE
reviewSchema.post('save', async function () {
  await (this.constructor as ReviewModel).calcAvgRatings(
    this.targetId,
    this.targetType,
  );
});

// TRIGGERING CALCAVG RATINGS AFTER UPDATE AND DELETE

reviewSchema.post('findOneAndUpdate', async function (doc, next) {
  if (!doc) return next;
  await Review.calcAvgRatings(doc.targetId, doc.targetType);
});
reviewSchema.post('findOneAndDelete', async function (doc, next) {
  if (!doc) return next;

  await Review.calcAvgRatings(doc.targetId, doc.targetType);
});

// ONE REVIEW PER PERSON PER ITEM
reviewSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

const Review = model<IReview, ReviewModel>('Review', reviewSchema);
export default Review;
