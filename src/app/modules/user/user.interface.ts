import { Document, Model } from 'mongoose';
import { TMethod, USER_ROLE } from './user.constant';
import { IUserName } from '../../interface/user';

export type TUserRole = keyof typeof USER_ROLE;

export interface IUser extends Document {
  name: IUserName;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  phoneNumber: string;
  role: TUserRole;
  method?: TMethod;
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<IUser> {
  //instance methods for checking if the user exist
  isUserExistsById(id: string): Promise<IUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
