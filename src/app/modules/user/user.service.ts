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

const socialLogin = async (
  payload: Partial<IUser> & { profileImg?: string },
) => {
  const { email, name, method, profileImg } = payload;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if user already exists
    let user = await User.findOne({ email }).session(session);

    if (!user) {
      // Generate a random password for social login users
      const randomPassword =
        Math.random().toString(36).slice(-16) +
        Math.random().toString(36).slice(-16);

      // Create new user with generated password

      const newUser = await User.create(
        [
          {
            email,
            name,
            password: randomPassword, // Required field
            method,
            role: 'customer', // Default role
            status: 'in-progress', // Assuming you want to activate social login users immediately
            isDeleted: false,
          },
        ],
        { session },
      );

      if (!newUser || !newUser.length) {
        throw new AppError(400, 'Failed to create user');
      }

      user = newUser[0];

      // Create customer profile
      await Customer.create(
        [
          {
            user: user._id,
            name,
            email,
            profileImg: profileImg || '',
            method,
          },
        ],
        { session },
      );
    }

    // Prepare JWT payload
    const customer = await Customer.findOne({ user: user._id }).session(
      session,
    );

    const jwtPayload = {
      email: user.email,
      role: user.role,
      id: user._id,
      profileImg: customer?.profileImg || '',
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

    await session.commitTransaction();
    session.endSession();

    return {
      accessToken,
      refreshToken,
      user: jwtPayload,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

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
    payload.profileImg = payload.profileImg || file?.path || '';

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
    payload.profileImg = payload.profileImg || file?.path || '';

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
  socialLogin,
  createCustomerInDB,
  createAdminInDB,
  createProviderInDB,
  getMe,
  changeStatus,
};
