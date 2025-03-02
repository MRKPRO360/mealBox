import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { RecipeValidationSchema } from './recipe.validation';
import { RecipeController } from './recipe.controller';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.route('/').post(
  auth(USER_ROLE.admin),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    console.log(req.body);

    next();
  },
  validateRequest(RecipeValidationSchema.createRecipeSchema),
  RecipeController.createRecipe,
);

export default router;
