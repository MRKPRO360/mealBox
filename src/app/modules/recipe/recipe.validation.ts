import { z } from 'zod';

// Define the Ingredient schema
const ingredientSchema = z.object({
  name: z.string().min(1, { message: 'Ingredient name is required' }),
  quantity: z.string().min(1, { message: 'Quantity is required' }),
  contains: z.array(z.string()).optional(), // Optional field for allergens
});

// Define the NutritionValues schema
const nutritionValuesSchema = z.object({
  calories: z.string().min(1, { message: 'Calories are required' }),
  fat: z.string().min(1, { message: 'Fat is required' }),
  saturatedFat: z.string().min(1, { message: 'Saturated fat is required' }),
  carbohydrate: z.string().min(1, { message: 'Carbohydrate is required' }),
  sugar: z.string().min(1, { message: 'Sugar is required' }),
  dietaryFiber: z.string().min(1, { message: 'Dietary fiber is required' }),
  protein: z.string().min(1, { message: 'Protein is required' }),
  cholesterol: z.string().min(1, { message: 'Cholesterol is required' }),
  sodium: z.string().min(1, { message: 'Sodium is required' }),
});

// Define the Instruction schema
const instructionSchema = z.object({
  step: z.number().min(1, { message: 'Step number is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

// Define the Recipe schema
const createRecipeSchema = z.object({
  body: z.object({
    recipeName: z.string().min(1, { message: 'Recipe name is required' }),
    recipeMenuName: z
      .string()
      .min(1, { message: 'Recipe menu name is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    tags: z
      .array(z.string())
      .min(1, { message: 'At least one tag is required' }),
    allergens: z.array(z.string()).default([]),
    totalTime: z.string().min(1, { message: 'Total time is required' }),
    prepTime: z.string().min(1, { message: 'Prep time is required' }),
    difficulty: z.string().min(1, { message: 'Difficulty is required' }),
    ingredients: z
      .array(ingredientSchema)
      .min(1, { message: 'At least one ingredient is required' }),
    nutritionValues: nutritionValuesSchema,
    utensils: z
      .array(z.string())
      .min(1, { message: 'At least one utensil is required' }),
    instructions: z
      .array(instructionSchema)
      .min(1, { message: 'At least one instruction is required' }),
  }),
});

// Export the schemas
export const RecipeValidationSchema = {
  createRecipeSchema,
};
