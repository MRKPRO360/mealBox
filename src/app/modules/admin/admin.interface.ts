import { Model, Types } from 'mongoose';
import { USER_ROLE } from '../user/user.constant';
import { IUserAddress, IUserName } from '../../interface/user';

export interface IAdmin extends Document {
  name: IUserName;
  email: string;
  user: Types.ObjectId;
  phoneNumber: string;
  password: string;
  role: typeof USER_ROLE.admin;
  address: IUserAddress;
  profileImg: string;
  orderHistory?: Types.ObjectId[];
}

export interface AdminModel extends Model<IAdmin> {
  isAdminExistsById(id: string): Promise<IAdmin | null>;
}
