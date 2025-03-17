import { Types } from 'mongoose';

export interface IPersonalMealPlan {
  user: Types.ObjectId;
  week: Date;
  selectedMeals: Types.ObjectId[];
  isDeleted: boolean;
}
