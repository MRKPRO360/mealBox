import { IUserName } from '../../interface/user';
import { USER_ROLE } from '../user/user.constant';

export interface IAdmin extends Document {
  name: IUserName;
  email: string;
  phoneNumber: string;
  password: string;
  role: typeof USER_ROLE.admin;
}
