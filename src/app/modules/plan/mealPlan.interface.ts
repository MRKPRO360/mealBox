import { Types } from 'mongoose';

export interface IMealPlan {
  week: string;
  meals: Types.ObjectId;
}
