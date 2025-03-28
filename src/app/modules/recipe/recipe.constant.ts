export const recipeSearchableFields = [
  'recipeName',
  'description',
  'tags',
  'ingredients.name',
  'allergens',
  'difficulty',
  'totalTime',
  'prepTime',
  'nutritionValues.calories',
  'nutritionValues.fat',
  'nutritionValues.protein',
  'utensils',
  'instructions.description',
];

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

export type TDifficulties = (typeof DIFFICULTIES)[number];
