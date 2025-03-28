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
import Provider from '../provider/provider.model';
import Admin from '../admin/admin.model';

const createCustomerInDB = async (
  file: any,
  password: string,
  payload: ICustomer,
) => {
  const userData: Partial<IUser> = {};
  const randomPass = Math.ceil(Math.random() * 1000000).toString();

  userData.password = password || randomPass;
  userData.email = payload.email;
  userData.method = payload.method;
  userData.phoneNumber = payload.phoneNumber || '';
  userData.role = USER_ROLE.customer;
  userData.name = payload.name;

  const session = await mongoose.startSession();
  session.startTransaction();
  console.log(userData);

  try {
    // CREATING USER
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(400, 'Failed to create user!');
    }

    payload.profileImg = payload.profileImg || file?.path || '';
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
      profileImg: newCustomer[0].profileImg,
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

const createAdminInDB = async (
  file: any,
  password: string,
  payload: ICustomer,
) => {
  const userData: Partial<IUser> = {};

  userData.password = password;
  userData.email = payload.email;
  userData.method = payload.method;
  userData.phoneNumber = payload.phoneNumber;
  userData.role = USER_ROLE.admin;
  userData.name = payload.name;

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
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(400, 'Failed to create admin!');
    }

    await session.commitTransaction();
    await session.endSession();

    const jwtPayload = {
      email: newUser[0].email,
      role: newUser[0].role,
      id: newUser[0]._id,
      profileImg: newAdmin[0].profileImg,
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

const createProviderInDB = async (
  file: any,
  password: string,
  payload: ICustomer,
) => {
  const userData: Partial<IUser> = {};

  userData.password = password;
  userData.email = payload.email;
  userData.method = payload.method;
  userData.phoneNumber = payload.phoneNumber;
  userData.role = USER_ROLE.provider;
  userData.name = payload.name;

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

    // CREATING PROVIDER
    const newProvider = await Provider.create([payload], { session });

    if (!newProvider.length) {
      throw new AppError(400, 'Failed to create meal provider!');
    }

    await session.commitTransaction();
    await session.endSession();

    const jwtPayload = {
      email: newUser[0].email,
      role: newUser[0].role,
      id: newUser[0]._id,
      profileImg: newProvider[0].profileImg,
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

const getMe = async (userId: string, role: string) => {
  let result = null;
  if (role === USER_ROLE.customer) {
    result = await Customer.findOne({ user: userId }).populate('user');
  }
  if (role === USER_ROLE.provider) {
    result = await Provider.findOne({ user: userId }).populate('user');
  }

  if (role === USER_ROLE.admin) {
    result = await Admin.findOne({ user: userId }).populate('user');
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  createCustomerInDB,
  createAdminInDB,
  createProviderInDB,
  getMe,
  changeStatus,
};
