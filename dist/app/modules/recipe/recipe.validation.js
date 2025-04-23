"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeValidationSchema = void 0;
const zod_1 = require("zod");
const recipe_constant_1 = require("./recipe.constant");
// Define the Ingredient schema
const ingredientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Ingredient name is required' }),
    quantity: zod_1.z.string().min(1, { message: 'Quantity is required' }),
    contains: zod_1.z.array(zod_1.z.string()).optional(), // Optional field for allergens
});
// Define the NutritionValues schema
const nutritionValuesSchema = zod_1.z
    .object({
    calories: zod_1.z.string().optional(),
    fat: zod_1.z.string().optional(),
    saturatedFat: zod_1.z.string().optional(),
    carbohydrate: zod_1.z.string().optional(),
    sugar: zod_1.z.string().optional(),
    dietaryFiber: zod_1.z.string().optional(),
    protein: zod_1.z.string().optional(),
    cholesterol: zod_1.z.string().optional(),
    sodium: zod_1.z.string().optional(),
})
    .optional();
// Define the Instruction schema
const instructionSchema = zod_1.z.object({
    step: zod_1.z.number().min(1, { message: 'Step number is required' }),
    description: zod_1.z.string().min(1, { message: 'Description is required' }),
});
const updateIngredientSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, { message: 'Ingredient name is required' })
        .optional(),
    quantity: zod_1.z.string().min(1, { message: 'Quantity is required' }).optional(),
    contains: zod_1.z.array(zod_1.z.string()).optional(), // Optional field for allergens
});
const updateInstructionSchema = zod_1.z.object({
    step: zod_1.z.number().min(1, { message: 'Step number is required' }).optional(),
    description: zod_1.z
        .string()
        .min(1, { message: 'Description is required' })
        .optional(),
});
// Define the Recipe schema
const createRecipeValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        recipeName: zod_1.z.string().min(1, { message: 'Recipe name is required' }),
        recipeMenuName: zod_1.z
            .string()
            .min(1, { message: 'Recipe menu name is required' }),
        providerId: zod_1.z.string().min(1, { message: 'Provider ID is required' }),
        description: zod_1.z.string().min(1, { message: 'Description is required' }),
        tags: zod_1.z
            .array(zod_1.z.string())
            .min(1, { message: 'At least one tag is required' }),
        allergens: zod_1.z.array(zod_1.z.string()).default([]),
        totalTime: zod_1.z.string().min(1, { message: 'Total time is required' }),
        prepTime: zod_1.z.string().min(1, { message: 'Prep time is required' }),
        difficulty: zod_1.z.enum(recipe_constant_1.DIFFICULTIES),
        ingredients: zod_1.z
            .array(ingredientSchema)
            .min(1, { message: 'At least one ingredient is required' }),
        nutritionValues: nutritionValuesSchema,
        utensils: zod_1.z
            .array(zod_1.z.string())
            .min(1, { message: 'At least one utensil is required' }),
        instructions: zod_1.z
            .array(instructionSchema)
            .min(1, { message: 'At least one instruction is required' }),
        inStock: zod_1.z.boolean().optional(),
        quantity: zod_1.z.string({ required_error: 'Quantity must be provided' }),
        rating: zod_1.z.string().optional(),
        ratingsCount: zod_1.z.string().optional(),
        portionSizes: zod_1.z.object({
            small: zod_1.z.object({
                price: zod_1.z.string(),
                servings: zod_1.z.string(),
            }),
            medium: zod_1.z.object({
                price: zod_1.z.string(),
                servings: zod_1.z.string(),
            }),
            large: zod_1.z.object({
                price: zod_1.z.string(),
                servings: zod_1.z.string(),
            }),
        }),
    }),
});
const updateRecipeValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        recipeName: zod_1.z
            .string()
            .min(1, { message: 'Recipe name is required' })
            .optional(),
        recipeMenuName: zod_1.z
            .string()
            .min(1, { message: 'Recipe menu name is required' })
            .optional(),
        providerId: zod_1.z
            .string()
            .min(1, { message: 'Provider ID is required' })
            .optional(),
        description: zod_1.z
            .string()
            .min(1, { message: 'Description is required' })
            .optional(),
        tags: zod_1.z
            .array(zod_1.z.string())
            .min(1, { message: 'At least one tag is required' })
            .optional(),
        allergens: zod_1.z.array(zod_1.z.string()).default([]).optional(),
        totalTime: zod_1.z
            .string()
            .min(1, { message: 'Total time is required' })
            .optional(),
        prepTime: zod_1.z
            .string()
            .min(1, { message: 'Prep time is required' })
            .optional(),
        difficulty: zod_1.z.enum(recipe_constant_1.DIFFICULTIES),
        ingredients: zod_1.z
            .array(updateIngredientSchema)
            .min(1, { message: 'At least one ingredient is required' })
            .optional(),
        nutritionValues: nutritionValuesSchema.optional(),
        utensils: zod_1.z
            .array(zod_1.z.string())
            .min(1, { message: 'At least one utensil is required' })
            .optional(),
        instructions: zod_1.z
            .array(updateInstructionSchema)
            .min(1, { message: 'At least one instruction is required' })
            .optional(),
        inStock: zod_1.z.boolean().optional(),
        quantity: zod_1.z
            .string({ required_error: 'Quantity must be provided' })
            .optional(),
        rating: zod_1.z.string().optional(),
        ratingsCount: zod_1.z.string().optional(),
        portionSizes: zod_1.z.object({
            small: zod_1.z.object({
                price: zod_1.z.string().optional(),
                servings: zod_1.z.string().optional(),
            }),
            medium: zod_1.z.object({
                price: zod_1.z.string().optional(),
                servings: zod_1.z.string().optional(),
            }),
            large: zod_1.z
                .object({
                price: zod_1.z.string().optional(),
                servings: zod_1.z.string().optional(),
            })
                .optional(),
        }),
    }),
});
// Export the schemas
exports.RecipeValidationSchema = {
    createRecipeValidationSchema,
    updateRecipeValidationSchema,
};
