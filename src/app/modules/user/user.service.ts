/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from 'mongoose';
import { IUser } from './user.interface';
import { ICustomer } from '../customer/customer.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import { USER_ROLE } from './user.constant';
import Customer from '../customer/customer.model';
import createToken from '../auth/auth.utils';
import config from '../../config';

const createCustomerInDB = async (
  file: any,
  password: string,
  payload: ICustomer,
) => {
  const userData: Partial<IUser> = {};

  userData.password = password;
  userData.email = payload.email;
  userData.method = payload.method;
  userData.phoneNumber = payload.phoneNumber;
  userData.role = USER_ROLE.customer;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    payload.profileImg = file.path || '';

    // CREATING USER
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(400, 'Failed to create user!');
    }

    payload.user = newUser[0]._id as Types.ObjectId;

    // CREATING CUSTOMER
    const newCustomer = await Customer.create([payload], { session });

    if (!newCustomer.length) {
      throw new AppError(400, 'Failed to create customer!');
    }

    await session.commitTransaction();
    await session.endSession();

    const jwtPayload = {
      email: newUser[0].email,
      role: newUser[0].role,
      id: newUser[0]._id,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    return {
      accessToken,
      refreshToken,
    };
  } catch (err: any) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createCustomerInDB,
};
