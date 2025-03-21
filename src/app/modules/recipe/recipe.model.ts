import { model, Schema } from 'mongoose';
import {
  IIngredient,
  IInstruction,
  INutritionValues,
  IRecipe,
} from './recipe.interface';

// Define the Ingredient schema
const ingredientSchema = new Schema<IIngredient>({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  contains: { type: [String], default: [] }, // Optional field for allergens
});

// Define the NutritionValues schema
const nutritionValuesSchema = new Schema<INutritionValues>({
  calories: { type: String, required: true },
  fat: { type: String, required: true },
  saturatedFat: { type: String, required: true },
  carbohydrate: { type: String, required: true },
  sugar: { type: String, required: true },
  dietaryFiber: { type: String, required: true },
  protein: { type: String, required: true },
  cholesterol: { type: String, required: true },
  sodium: { type: String, required: true },
});
// Define the Instruction schema
const instructionSchema = new Schema<IInstruction>({
  step: { type: Number, required: true },
  description: { type: String, required: true },
});

// Define the Recipe schema
const recipeSchema = new Schema<IRecipe>(
  {
    recipeName: { type: String, required: true },
    recipeImage: { type: String, required: true },
    recipeMenuName: { type: Schema.ObjectId, ref: 'MenuName', required: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true },
    allergens: { type: [String], required: true },
    totalTime: { type: String, required: true },
    prepTime: { type: String, required: true },
    difficulty: { type: String, required: true },
    ingredients: { type: [ingredientSchema], required: true },
    nutritionValues: { type: nutritionValuesSchema, required: true },
    utensils: { type: [String], required: true },
    instructions: { type: [instructionSchema], required: true },
    isDeleted: { type: Boolean, default: false }, // Optional field for soft delete functionality, default to false for active records.
    pricePerServing: { type: String, required: true },
    servings: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

// FILTERING OUT THE DELETED RECIPE
recipeSchema.pre('find', function (next) {
  // this.model
  //   .updateMany(
  //     { isDeleted: { $ne: true } },
  //     { $set: { pricePerServing: '9.99', servings: '2' } },
  //     { multi: true }, // Update all matching documents
  //   )
  //   .exec();

  this.where('isDeleted', false);
  next();
});
recipeSchema.pre('findOne', function (next) {
  this.where('isDeleted', false);
  next();
});

const Recipe = model<IRecipe>('Recipe', recipeSchema);

export default Recipe;
