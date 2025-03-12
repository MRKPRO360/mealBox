/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config';
import AppError from '../../errors/AppError';
import createToken from './auth.utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../user/user.model';
import { ILogin } from './auth.interface';
import { USER_ROLE } from '../user/user.constant';
import Customer from '../customer/customer.model';
import Admin from '../admin/admin.model';
import Provider from '../provider/provider.model';

const loginUserFromDB = async (payload: ILogin) => {
  // CHECK IF USER EXISTS
  const user = await User.findOne({ email: payload.email }).select('+password');

  if (!user) throw new AppError(404, 'User not found!');

  // CHECK IF USER IS BLOCKED
  if (user.status === 'blocked') throw new AppError(403, 'User is blocked!');

  // CHECK IF PASSWORD IS CORRECT
  const isPasswordCorrect = await User.isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!isPasswordCorrect) throw new AppError(401, 'Incorrect password!');

  // CHECK IF USER IS DELETED
  if (user.isDeleted) throw new AppError(403, 'User is deleted!');

  let profileImg = '';

  if (user.role === USER_ROLE.customer) {
    const customer = await Customer.findOne({ user: user._id });

    profileImg = customer?.profileImg as string;
  }

  if (user.role === USER_ROLE.mealProvider) {
    const provider = await Provider.findOne({ user: user._id });

    profileImg = provider?.profileImg as string;
  }
  if (user.role === USER_ROLE.admin) {
    const admin = await Admin.findOne({ user: user._id });

    profileImg = admin?.profileImg as string;
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
    id: user._id,
    profileImg: profileImg,
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
};

const refreshTokenFromDB = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { id } = decoded;

  const user = await User.isUserExistsById(id);

  if (!user) throw new AppError(404, 'This user is not found!');

  if (user.status === 'blocked') throw new AppError(403, 'User is blocked!');

  let profileImg = '';

  if (user.role === USER_ROLE.customer) {
    const customer = await Customer.findOne({ user: user._id });

    profileImg = customer?.profileImg as string;
  }

  if (user.role === USER_ROLE.mealProvider) {
    const provider = await Provider.findOne({ user: user._id });

    profileImg = provider?.profileImg as string;
  }
  if (user.role === USER_ROLE.admin) {
    const admin = await Admin.findOne({ user: user._id });

    profileImg = admin?.profileImg as string;
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
    id: user._id,
    profileImg: profileImg,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return { accessToken };
};

const changePasswordInDB = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const { id } = userData;

  // CHECK IF USER EXISTS
  const user = await User.isUserExistsById(id);

  // CHECK IF PASSWORD IS CORRECT
  const isPasswordCorrect = await User.isPasswordMatched(
    payload.oldPassword,
    user.password,
  );

  if (!isPasswordCorrect) throw new AppError(400, 'Incorrect password!');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return result;
};

export const authServices = {
  loginUserFromDB,
  refreshTokenFromDB,
  changePasswordInDB,
};
