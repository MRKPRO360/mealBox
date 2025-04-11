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
import QueryBuilder from '../../builder/QueryBuilder';
import {
  CUISINE_SPECIALTIES,
  providerSearchableFields,
} from './provider.constant';

const getAllProvidersFromDB = async (query: Record<string, unknown>) => {
  const providerQuery = new QueryBuilder(
    Provider.find()
      .populate({
        path: 'reviews',
        select: 'rating comment userId createdAt',
        populate: {
          path: 'userId',
          select: 'name email',
          populate: {
            path: 'customer',
            select: 'profileImg',
          },
        },
      })
      .lean() as any,
    query,
  )
    .search(providerSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const meta = await providerQuery.countTotal();
  const result = await providerQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleProviderFromDB = async (id: string) => {
  return await Provider.findById(id)
    .populate({
      path: 'reviews',
      select: 'rating comment userId createdAt',
      populate: {
        path: 'userId',
        select: 'name email',
        populate: {
          path: 'customer',
          select: 'profileImg',
        },
      },
    })
    .lean();
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
      role: USER_ROLE.provider,
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
      role: USER_ROLE.provider,
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

const getAllCuisineSpecialtiesFromDB = async () => {
  return [...CUISINE_SPECIALTIES];
};

export const ProviderServices = {
  getAllCuisineSpecialtiesFromDB,
  getAllProvidersFromDB,
  getSingleProviderFromDB,
  updateProviderInDB,
  deleteProviderFromDB,
};
