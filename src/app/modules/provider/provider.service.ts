/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import Provider from './provider.model';

const getAllProvidersFromDB = async () => {
  return await Provider.find({});
};

const getSingleProviderFromDB = async (id: string) => {
  return await Provider.findById(id);
};

const deleteProviderFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deletedProvider = await Provider.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedProvider) {
      throw new AppError(400, 'Failed to delete provider!');
    }

    const userId = deletedProvider.user;

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

    return deletedProvider;
  } catch (err: any) {
    console.log(err);

    await session.abortTransaction();
    session.endSession();
    throw new Error('Failed to delete provider!');
  }
};

export const ProviderServices = {
  getAllProvidersFromDB,
  getSingleProviderFromDB,
  deleteProviderFromDB,
};
