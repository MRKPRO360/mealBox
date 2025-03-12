import { Schema, model } from 'mongoose';
import { IPlan } from './mealPlan.interface';

const mealPlanSchema = new Schema<IPlan>({
  week: { type: String, required: true },
  meals: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
});

const MealPlan = model('MealPlan', mealPlanSchema);
export default MealPlan;
