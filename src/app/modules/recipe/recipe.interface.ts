import { Types } from 'mongoose';
import { TDifficulties } from './recipe.constant';

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
  providerId: Types.ObjectId;
  recipeImage: string;
  recipeName: string;
  description: string;
  tags: string[];
  allergens: string[];
  totalTime: string;
  prepTime: string;
  difficulty: TDifficulties;
  ingredients: IIngredient[];
  nutritionValues: INutritionValues;
  utensils: string[];
  instructions: IInstruction[];
  portionSizes: {
    small: {
      price: string;
      servings: string;
    };
    medium: {
      price: string;
      servings: string;
    };
    large: {
      price: string;
      servings: string;
    };
  };
  inStock: boolean;
  quantity: string;
  rating: string;
  isDeleted: boolean;
}
