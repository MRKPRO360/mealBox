import { Schema, model } from 'mongoose';
import { IPersonalMealPlan } from './personalMealPlan.interface';

const personalMealPlanSchema = new Schema<IPersonalMealPlan>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    week: { type: Date, required: true },
    selectedMeals: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  },
  {
    timestamps: true,
  },
);

const PersonalMealPlan = model<IPersonalMealPlan>(
  'personalMealPlan',
  personalMealPlanSchema,
);
export default PersonalMealPlan;
