import express, { NextFunction, Request, Response } from 'express';

import { multerUpload } from '../../config/multer.config';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { customerValidationsSchema } from '../customer/customer.validation';

const router = express.Router();

router.route('/').post(
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(customerValidationsSchema.createCustomerValidatonSchema),
  UserControllers.createCustomer,
);

export default router;
