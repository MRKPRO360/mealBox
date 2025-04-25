import { Schema, model } from 'mongoose';
import { IPersonalMealPlan } from './personalMealPlan.interface';

const personalMealPlanSchema = new Schema<IPersonalMealPlan>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    week: { type: Date, required: true },
    selectedMeals: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// FILTERING OUT THE DELETED SCHEMA
personalMealPlanSchema.pre('find', function (next) {
  this.where({ isDeleted: false });
  next();
});

personalMealPlanSchema.pre('findOne', function (next) {
  this.where({ isDeleted: false });
  next();
});

const PersonalMealPlan = model<IPersonalMealPlan>(
  'personalMealPlan',
  personalMealPlanSchema,
);
export default PersonalMealPlan;
