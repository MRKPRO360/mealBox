import { Schema, model } from 'mongoose';
import { IMealPlan } from './mealPlan.interface';

const mealPlanSchema = new Schema<IMealPlan>(
  {
    week: { type: Date, required: true },
    selectedMeals: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  },
  {
    timestamps: true,
  },
);

const MealPlan = model('MealPlan', mealPlanSchema);
export default MealPlan;
