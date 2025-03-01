import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidations } from './auth.validation';
import { authControllers } from './auth.controllers';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router
  .route('/login')
  .post(
    validateRequest(authValidations.loginValidationSchema),
    authControllers.loginUser,
  );

router.post(
  '/refresh-token',
  validateRequest(authValidations.refreshTokenValidationSchema),
  authControllers.refreshToken,
);

router.post(
  '/change-password',
  auth(
    USER_ROLE.customer,
    USER_ROLE.admin,
    USER_ROLE.mealProvider,
    USER_ROLE.superAdmin,
  ),
  validateRequest(authValidations.changePasswordValidationSchema),
  authControllers.changePassword,
);

export default router;
