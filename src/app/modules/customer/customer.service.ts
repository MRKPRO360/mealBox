/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import Customer from './customer.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';

const getAllCustomersFromDB = async () => {
  return await Customer.find({});
};

const getSingleCustomerFromDB = async (id: string) => {
  return await Customer.findById(id);
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

export const CustomerServices = {
  getAllCustomersFromDB,
  getSingleCustomerFromDB,
  deleteCustomerFromDB,
};
