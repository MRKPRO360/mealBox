export const dietaryPreferences = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Low-Carb',
  'Keto',
  'Paleo',
  'Low-Fat',
  'Sugar-Free',
  'Halal',
  'Kosher',
  'Organic',
  'Raw',
] as const;

export type DietaryPreference = (typeof dietaryPreferences)[number];
