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

const updateIngredientSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Ingredient name is required' })
    .optional(),
  quantity: z.string().min(1, { message: 'Quantity is required' }).optional(),
  contains: z.array(z.string()).optional(), // Optional field for allergens
});

const updateNutritionValuesSchema = z.object({
  calories: z.string().min(1, { message: 'Calories are required' }).optional(),
  fat: z.string().min(1, { message: 'Fat is required' }).optional(),
  saturatedFat: z
    .string()
    .min(1, { message: 'Saturated fat is required' })
    .optional(),
  carbohydrate: z
    .string()
    .min(1, { message: 'Carbohydrate is required' })
    .optional(),
  sugar: z.string().min(1, { message: 'Sugar is required' }).optional(),
  dietaryFiber: z
    .string()
    .min(1, { message: 'Dietary fiber is required' })
    .optional(),
  protein: z.string().min(1, { message: 'Protein is required' }).optional(),
  cholesterol: z
    .string()
    .min(1, { message: 'Cholesterol is required' })
    .optional(),
  sodium: z.string().min(1, { message: 'Sodium is required' }).optional(),
});

const updateInstructionSchema = z.object({
  step: z.number().min(1, { message: 'Step number is required' }).optional(),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .optional(),
});

// Define the Recipe schema
const createRecipeValidationSchema = z.object({
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

const updateRecipeValidationSchema = z.object({
  body: z.object({
    recipeName: z
      .string()
      .min(1, { message: 'Recipe name is required' })
      .optional(),
    recipeMenuName: z
      .string()
      .min(1, { message: 'Recipe menu name is required' })
      .optional(),
    description: z
      .string()
      .min(1, { message: 'Description is required' })
      .optional(),
    tags: z
      .array(z.string())
      .min(1, { message: 'At least one tag is required' })
      .optional(),
    allergens: z.array(z.string()).default([]).optional(),
    totalTime: z
      .string()
      .min(1, { message: 'Total time is required' })
      .optional(),
    prepTime: z
      .string()
      .min(1, { message: 'Prep time is required' })
      .optional(),
    difficulty: z
      .string()
      .min(1, { message: 'Difficulty is required' })
      .optional(),
    ingredients: z
      .array(updateIngredientSchema)
      .min(1, { message: 'At least one ingredient is required' })
      .optional(),
    nutritionValues: updateNutritionValuesSchema.optional(),
    utensils: z
      .array(z.string())
      .min(1, { message: 'At least one utensil is required' })
      .optional(),
    instructions: z
      .array(updateInstructionSchema)
      .min(1, { message: 'At least one instruction is required' })
      .optional(),
  }),
});

// Export the schemas
export const RecipeValidationSchema = {
  createRecipeValidationSchema,
  updateRecipeValidationSchema,
};
