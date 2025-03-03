import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { ProviderControllers } from './provider.controller';

const router = express.Router();

router
  .route('/')
  .get(auth(USER_ROLE.admin), ProviderControllers.getAllProviders);

router
  .route('/:id')
  .get(auth(USER_ROLE.admin), ProviderControllers.getSingleProvider)
  .delete(auth(USER_ROLE.admin), ProviderControllers.deleteProvider);

export default router;
