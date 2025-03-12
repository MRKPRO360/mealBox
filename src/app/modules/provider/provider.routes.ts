import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { ProviderControllers } from './provider.controller';
import { multerUpload } from '../../config/multer.config';
import validateRequest from '../../middlewares/validateRequest';
import { ProviderValidationsSchema } from './provider.validation';

const router = express.Router();

router
  .route('/')
  .get(auth(USER_ROLE.admin), ProviderControllers.getAllProviders)
  .patch(
    auth(USER_ROLE.admin, USER_ROLE.mealProvider),
    multerUpload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(ProviderValidationsSchema.updateProviderValidatonSchema),
    ProviderControllers.updateProvider,
  );

router
  .route('/:id')
  .get(auth(USER_ROLE.admin), ProviderControllers.getSingleProvider)
  .delete(auth(USER_ROLE.admin), ProviderControllers.deleteProvider);

export default router;
