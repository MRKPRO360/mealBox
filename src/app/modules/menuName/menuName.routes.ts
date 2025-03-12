import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { MenuNameControllers } from './menuName.controller';
import { multerUpload } from '../../config/multer.config';
import validateRequest from '../../middlewares/validateRequest';
import { MenuNameSchemaValidation } from './menuName.validation';

const router = express.Router();

router
  .route('/')
  .get(MenuNameControllers.getAllMenuName)
  .post(
    auth(USER_ROLE.mealProvider, USER_ROLE.admin, USER_ROLE.superAdmin),
    multerUpload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(MenuNameSchemaValidation.createMenuNameSchemaValidation),
    MenuNameControllers.createMenuName,
  );

router
  .route('/:id')
  .delete(
    auth(USER_ROLE.mealProvider, USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(MenuNameSchemaValidation.updateMenuNameSchemaValidation),

    MenuNameControllers.deleteMenuName,
  )
  .patch(
    auth(USER_ROLE.mealProvider, USER_ROLE.admin, USER_ROLE.superAdmin),
    MenuNameControllers.deleteMenuName,
  );

export default router;
