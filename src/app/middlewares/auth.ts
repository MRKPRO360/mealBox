/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
/* eslint-disable no-console */
import config from '../config';
import AppError from '../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import { TUserRole } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    // CHECK IF THE TOKEN IS EXISTS
    if (!token) throw new AppError(403, 'You are not authorized!');

    // CHECK IF THE TOKEN IS VALID
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (err: any) {
      console.log(err);

      throw new AppError(401, 'Token is invalid!');
    }

    const { role, id } = decoded as JwtPayload;
    //CHECK IF THE USER IS EXISTS
    const user = await User.isUserExistsById(id);

    if (!user) throw new AppError(404, 'This user does not exists!');

    //CHECK IF THE USER IS BLOCKED
    if (user && user.status === 'blocked')
      throw new AppError(403, 'You are not authorized!');

    //CHECK IF THE USER IS DELETED
    if (user && user.isDeleted)
      throw new AppError(403, 'You are not authorized!');

    //CHECK IF THE USER ROLE IS CORRECT
    if (requiredRoles && !requiredRoles.includes(role))
      throw new AppError(403, 'You are not authorized');

    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
