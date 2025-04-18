/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import Customer from './customer.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { ICustomer } from './customer.interface';

import { USER_ROLE } from '../user/user.constant';
import createToken from '../auth/auth.utils';
import config from '../../config';

const getAllCustomersFromDB = async () => {
  return await Customer.find({});
};

const getSingleCustomerFromDB = async (id: string) => {
  return await Customer.findById(id);
};

const getCustomerPreferencesFromDB = async (userId: string, role: string) => {
  let result = null;
  if (role === USER_ROLE.customer) {
    result = await Customer.findOne({ user: userId }).select(
      'dietaryPreferences',
    );
  }

  return result;
};

const deleteCustomerFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deletedCustomer = await Customer.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedCustomer) {
      throw new AppError(400, 'Failed to delete customer!');
    }

    const userId = deletedCustomer.user;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      {
        new: true,
        session,
      },
    );

    if (!deletedUser) {
      throw new AppError(400, 'Failed to delete user!');
    }

    await session.commitTransaction();
    session.endSession();

    return deletedCustomer;
  } catch (err: any) {
    console.log(err);

    await session.abortTransaction();
    session.endSession();
    throw new Error('Failed to delete customer!');
  }
};

const updateCustomerInDB = async (payload: Partial<ICustomer>, file?: any) => {
  if (!payload._id) {
    throw new AppError(404, "Customer id isn't provided");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch existing user & customer
    const customer = await Customer.findById(payload._id).session(session);

    const user = await User.findOne({
      email: customer?.email,
      role: USER_ROLE.customer,
    }).session(session);

    if (!user || !customer) {
      throw new AppError(404, 'User or Customer not found');
    }

    // If a new image is uploaded, update profileImg for both User and Customer
    if (file?.path) {
      payload.profileImg = file.path || payload.profileImg;
    }

    const { _id, ...data } = payload;

    // Update User
    await User.findByIdAndUpdate(user._id, data, {
      session,
      new: true,
    });

    // Update Customer

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customer._id,
      data,
      {
        session,
        new: true,
      },
    );

    await session.commitTransaction();
    await session.endSession();

    if (!updatedCustomer) throw new AppError(400, 'Customer update failed!');
    const jwtPayload = {
      email: updatedCustomer.email,
      role: USER_ROLE.customer,
      id: user._id,
      profileImg: updatedCustomer.profileImg,
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

export const CustomerServices = {
  getCustomerPreferencesFromDB,
  getAllCustomersFromDB,
  getSingleCustomerFromDB,
  updateCustomerInDB,
  deleteCustomerFromDB,
};
