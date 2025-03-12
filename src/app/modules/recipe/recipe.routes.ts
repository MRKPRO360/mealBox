import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { RecipeValidationSchema } from './recipe.validation';
import { RecipeControllers } from './recipe.controller';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.mealProvider),
    multerUpload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(RecipeValidationSchema.createRecipeValidationSchema),
    RecipeControllers.createRecipe,
  )
  .get(RecipeControllers.getAllRecipes);

router
  .route('/:id')
  .patch(
    auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.mealProvider),
    multerUpload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(RecipeValidationSchema.updateRecipeValidationSchema),
    RecipeControllers.updateSingleRecipe,
  )
  .get(RecipeControllers.getSingleRecipe)
  .delete(
    auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.mealProvider),
    RecipeControllers.deleteRecipe,
  );

export default router;
