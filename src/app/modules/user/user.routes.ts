import express, { NextFunction, Request, Response } from 'express';

import { multerUpload } from '../../config/multer.config';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { customerValidationsSchema } from '../customer/customer.validation';
import { AdminValidationSchema } from '../admin/admin.validation';
import { ProviderValidationsSchema } from '../provider/provider.validation';
import { USER_ROLE } from './user.constant';
import auth from '../../middlewares/auth';
import { UserValidation } from './user.validation';

const router = express.Router();

router.route('/create-customer').post(
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(customerValidationsSchema.createCustomerValidatonSchema),
  UserControllers.createCustomer,
);
router.route('/create-provider').post(
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(ProviderValidationsSchema.createProviderValidatonSchema),
  UserControllers.createProvider,
);
router.route('/create-admin').post(
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(AdminValidationSchema.createAdminValidationSchema),
  UserControllers.createAdmin,
);

router.post(
  '/change-status/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

router.get(
  '/me',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.mealProvider,
    USER_ROLE.customer,
  ),
  UserControllers.getMe,
);

export default router;
