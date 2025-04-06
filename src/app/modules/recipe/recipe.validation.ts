import { z } from 'zod';
import { DIFFICULTIES } from './recipe.constant';

// Define the Ingredient schema
const ingredientSchema = z.object({
  name: z.string().min(1, { message: 'Ingredient name is required' }),
  quantity: z.string().min(1, { message: 'Quantity is required' }),
  contains: z.array(z.string()).optional(), // Optional field for allergens
});

// Define the NutritionValues schema
const nutritionValuesSchema = z
  .object({
    calories: z.string().optional(),
    fat: z.string().optional(),
    saturatedFat: z.string().optional(),
    carbohydrate: z.string().optional(),
    sugar: z.string().optional(),
    dietaryFiber: z.string().optional(),
    protein: z.string().optional(),
    cholesterol: z.string().optional(),
    sodium: z.string().optional(),
  })
  .optional();

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
    providerId: z.string().min(1, { message: 'Provider ID is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    tags: z
      .array(z.string())
      .min(1, { message: 'At least one tag is required' }),
    allergens: z.array(z.string()).default([]),
    totalTime: z.string().min(1, { message: 'Total time is required' }),
    prepTime: z.string().min(1, { message: 'Prep time is required' }),
    difficulty: z.enum(DIFFICULTIES),
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

    inStock: z.boolean().optional(),
    quantity: z.string({ required_error: 'Quantity must be provided' }),
    rating: z.string().optional(),
    ratingsCount: z.string().optional(),
    portionSizes: z.object({
      small: z.object({
        price: z.string(),
        servings: z.string(),
      }),
      medium: z.object({
        price: z.string(),
        servings: z.string(),
      }),
      large: z.object({
        price: z.string(),
        servings: z.string(),
      }),
    }),
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
    providerId: z
      .string()
      .min(1, { message: 'Provider ID is required' })
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
    difficulty: z.enum(DIFFICULTIES),
    ingredients: z
      .array(updateIngredientSchema)
      .min(1, { message: 'At least one ingredient is required' })
      .optional(),
    nutritionValues: nutritionValuesSchema.optional(),
    utensils: z
      .array(z.string())
      .min(1, { message: 'At least one utensil is required' })
      .optional(),
    instructions: z
      .array(updateInstructionSchema)
      .min(1, { message: 'At least one instruction is required' })
      .optional(),
    inStock: z.boolean().optional(),
    quantity: z
      .string({ required_error: 'Quantity must be provided' })
      .optional(),
    rating: z.string().optional(),
    ratingsCount: z.string().optional(),
    portionSizes: z.object({
      small: z.object({
        price: z.string().optional(),
        servings: z.string().optional(),
      }),
      medium: z.object({
        price: z.string().optional(),
        servings: z.string().optional(),
      }),
      large: z
        .object({
          price: z.string().optional(),
          servings: z.string().optional(),
        })
        .optional(),
    }),
  }),
});

// Export the schemas
export const RecipeValidationSchema = {
  createRecipeValidationSchema,
  updateRecipeValidationSchema,
};
