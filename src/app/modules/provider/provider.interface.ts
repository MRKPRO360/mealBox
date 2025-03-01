import { USER_ROLE } from '../user/user.constant';

export interface IMealProvider extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: typeof USER_ROLE.mealProvider;
  cuisineSpecialties: string[]; // e.g., ["Italian", "Asian", "Vegan"]
  availableMeals: string[]; // List of meal names
  pricing: number;
  experience?: string; // e.g., "5 years in food industry"
  customerReviews?: { rating: number; comment: string }[];
}
