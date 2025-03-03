import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { CustomerControllers } from './customer.controller';

const router = express.Router();

router
  .route('/')
  .get(auth(USER_ROLE.admin), CustomerControllers.getAllCustomers);

router
  .route('/:id')
  .get(auth(USER_ROLE.admin), CustomerControllers.getSingleCustomer)
  .delete(auth(USER_ROLE.admin), CustomerControllers.deleteCustomer);

export default router;
