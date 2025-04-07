import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';
import { ReviewControllers } from './review.controller';

const router = express.Router();

router
  .route('/elegibility')
  .get(auth(USER_ROLE.customer), ReviewControllers.checkReviewEleigibility);

router
  .route('/')
  .post(
    auth(USER_ROLE.customer),
    validateRequest(ReviewValidation.createReviewValidationSchema),
    ReviewControllers.createReview,
  );

router
  .route('/:id')
  .patch(
    auth(USER_ROLE.customer),
    validateRequest(ReviewValidation.updateReviewValidationSchema),
    ReviewControllers.updateReview,
  )
  .delete(auth(USER_ROLE.customer), ReviewControllers.deleteSingleReview);

router.get(
  '/providers',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.provider),
  ReviewControllers.getAllProviderReviews,
);
router.get(
  '/recipes',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.provider),
  ReviewControllers.getAllRecipeReviews,
);

export default router;
