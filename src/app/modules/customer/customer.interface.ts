import { Document, Model, Types } from 'mongoose';
import { TMethod } from '../user/user.constant';

export type IUserName = {
  firstName: string;
  lastName: string;
};

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ICustomer extends Document {
  name: IUserName;
  email: string;
  phoneNumber: string;
  user: Types.ObjectId;
  dietaryPreferences?: string[];
  orderHistory?: Types.ObjectId[];
  profileImg?: string;
  address?: IAddress;
  method?: TMethod;
}

export interface CustomerModel extends Model<ICustomer> {
  isCustomerExistsById(id: string): Promise<ICustomer | null>;
}
