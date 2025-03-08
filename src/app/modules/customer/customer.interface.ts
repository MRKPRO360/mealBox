import { Document, Model, Types } from 'mongoose';
import { TMethod } from '../user/user.constant';
import { IUserAddress, IUserName } from '../../interface/user';
import { DietaryPreference } from './customer.constant';

export interface ICustomer extends Document {
  name: IUserName;
  email: string;
  phoneNumber: string;
  user: Types.ObjectId;
  dietaryPreferences?: DietaryPreference[];
  orderHistory?: Types.ObjectId[];
  profileImg?: string;
  address?: IUserAddress;
  method?: TMethod;
}

export interface CustomerModel extends Model<ICustomer> {
  isCustomerExistsById(id: string): Promise<ICustomer | null>;
}
