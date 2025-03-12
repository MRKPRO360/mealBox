import { Types } from 'mongoose';

export interface IIngredient {
  name: string;
  quantity: string;
  contains?: string[];
}

export interface INutritionValues {
  calories: string;
  fat: string;
  saturatedFat: string;
  carbohydrate: string;
  sugar: string;
  dietaryFiber: string;
  protein: string;
  cholesterol: string;
  sodium: string;
}

export interface IInstruction {
  step: number;
  description: string;
}

export interface IRecipe {
  recipeMenuName: Types.ObjectId;
  recipeImage: string;
  recipeName: string;
  description: string;
  tags: string[];
  allergens: string[];
  totalTime: string;
  prepTime: string;
  difficulty: string;
  ingredients: IIngredient[];
  nutritionValues: INutritionValues;
  utensils: string[];
  instructions: IInstruction[];
  pricePerServing: string;
  servings: string;
  isDeleted: boolean;
}
