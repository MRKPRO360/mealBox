import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { RecipeValidationSchema } from './recipe.validation';
import { RecipeController } from './recipe.controller';

const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLE.admin),
    validateRequest(RecipeValidationSchema.createRecipeSchema),
    RecipeController.createRecipe,
  );

export default router;
