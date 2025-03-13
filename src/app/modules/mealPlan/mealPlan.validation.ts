import { z } from 'zod';

const createMealPlanValidationSchema = z.object({
  body: z.object({
    week: z.string(),
    selectedMeals: z
      .array(
        z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
          message: 'Invalid ObjectId format',
        }),
      )
      .optional(),
  }),
});

const updateMealPlanValidationSchema = z.object({
  body: z.object({
    week: z.string().optional(),
    selectedMeals: z
      .array(
        z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
          message: 'Invalid ObjectId format',
        }),
      )
      .optional(),
  }),
});
export const MealPlanValidation = {
  createMealPlanValidationSchema,
  updateMealPlanValidationSchema,
};
