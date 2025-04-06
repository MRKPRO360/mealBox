import { Document, Model, Types } from 'mongoose';

// review.model.ts

export type TReviewTargetType = 'recipe' | 'provider';

export interface IReview extends Document {
  //   _id: Types.ObjectId;
  userId: Types.ObjectId;
  targetType: TReviewTargetType; // or an enum
  targetId: Types.ObjectId; // references either Recipe or Provider based on targetType
  rating: number;
  comment: string;
}

export interface ReviewModel extends Model<IReview> {
  calcAvgRatings: (
    targetId: Types.ObjectId,
    targetType: TReviewTargetType,
  ) => Promise<void>;
}
