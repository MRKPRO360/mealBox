export const recipeMenuNames = [
  'Meat & Veggies',
  'Vegetarian',
  'Family-Friendly',
  'Calorie Smart',
  'Quick & Easy',
  'Pescatarian',
  'Low-Carb',
  'Keto',
  'Vegan',
  'Gluten-Free',
  'Comfort Food',
  'High-Protein',
  'Kid-Friendly',
  'Healthy',
  'Gourmet',
] as const;

export type TRecipeMenuName = (typeof recipeMenuNames)[number];
