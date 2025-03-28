export const CUISINE_SPECIALTIES = [
  'Italian',
  'Chinese',
  'Indian',
  'Mexican',
  'Japanese',
  'French',
  'Mediterranean',
  'American',
  'Vegan',
  'Thai',
] as const;
export type TCusineSpecialties = (typeof CUISINE_SPECIALTIES)[number];
