import { Model, Types } from 'mongoose';
import { USER_ROLE } from '../user/user.constant';
import { IUserAddress, IUserName } from '../../interface/user';

export interface IProvider extends Document {
  _id: Types.ObjectId;
  name: IUserName;
  email: string;
  user: Types.ObjectId;
  phoneNumber: string;
  password: string;
  role: typeof USER_ROLE.mealProvider;
  pricing: number;
  address: IUserAddress;
  profileImg: string;
  experience?: string; // e.g., "5 years in food industry"
  orderHistory?: Types.ObjectId[];
  customerReviews?: { rating: number; comment: string }[];
}

export interface ProviderModel extends Model<IProvider> {
  isCustomerExistsById(id: string): Promise<IProvider | null>;
}
