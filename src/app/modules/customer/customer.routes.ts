import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { CustomerControllers } from './customer.controller';
import { multerUpload } from '../../config/multer.config';
import { customerValidationsSchema } from './customer.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router
  .route('/')
  .get(auth(USER_ROLE.admin), CustomerControllers.getAllCustomers)
  .patch(
    auth(USER_ROLE.admin, USER_ROLE.customer),
    multerUpload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(customerValidationsSchema.updateCustomerValidatonSchema),
    CustomerControllers.updateCustomer,
  );

router
  .route('/:id')
  .get(auth(USER_ROLE.admin), CustomerControllers.getSingleCustomer)

  .delete(auth(USER_ROLE.admin), CustomerControllers.deleteCustomer);

export default router;
