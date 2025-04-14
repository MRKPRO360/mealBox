import { Model, Types } from 'mongoose';
import { USER_ROLE } from '../user/user.constant';
import { IUserAddress, IUserName } from '../../interface/user';
import { TCusineSpecialties } from './provider.constant';
import { IReview } from '../review/review.interface';

export interface IProvider extends Document {
  _id: Types.ObjectId;
  name: IUserName;
  email: string;
  user: Types.ObjectId;
  bio: string;
  phoneNumber: string;
  password: string;
  role: typeof USER_ROLE.provider;
  pricing: number;
  address: IUserAddress;
  profileImg: string;
  experience?: string; // e.g., "5 years in food industry"
  cuisineSpecialties: TCusineSpecialties[];
  availableMealOptions: Types.ObjectId;
  rating: number;
  ratingsCount: number;
  createdAt: number;
  updatedAt: number;
  reviews: IReview[];
}

export interface ProviderModel extends Model<IProvider> {
  isCustomerExistsById(id: string): Promise<IProvider | null>;
}
