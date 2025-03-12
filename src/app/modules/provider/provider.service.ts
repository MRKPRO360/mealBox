/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import Provider from './provider.model';
import { IProvider } from './provider.interface';
import { USER_ROLE } from '../user/user.constant';
import createToken from '../auth/auth.utils';
import config from '../../config';

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

const updateProviderInDB = async (payload: Partial<IProvider>, file?: any) => {
  if (!payload._id) {
    throw new AppError(404, "Provider id isn't provided");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch existing user & customer
    const provider = await Provider.findById(payload._id).session(session);

    const user = await User.findOne({
      email: provider?.email,
      role: USER_ROLE.mealProvider,
    }).session(session);

    if (!user || !provider) {
      throw new AppError(404, 'User or Provider not found');
    }

    // If a new image is uploaded, update profileImg for both User and Customer
    if (file?.path) {
      payload.profileImg = file.path || '';
    }

    const { _id, ...data } = payload;

    // Update User
    await User.findByIdAndUpdate(user._id, data, {
      session,
      new: true,
    });

    // Update Customer

    const updatedProvider = await Provider.findByIdAndUpdate(
      provider._id,
      data,
      {
        session,
        new: true,
      },
    );

    await session.commitTransaction();
    await session.endSession();

    if (!updatedProvider) throw new AppError(400, 'Provider update failed!');
    const jwtPayload = {
      email: updatedProvider.email,
      role: USER_ROLE.mealProvider,
      id: user._id,
      profileImg: updatedProvider.profileImg,
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

export const ProviderServices = {
  getAllProvidersFromDB,
  getSingleProviderFromDB,
  updateProviderInDB,
  deleteProviderFromDB,
};
