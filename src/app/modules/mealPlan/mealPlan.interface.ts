import { Types } from 'mongoose';

export interface IMealPlan {
  week: Date;
  selectedMeals: Types.ObjectId[];
}
