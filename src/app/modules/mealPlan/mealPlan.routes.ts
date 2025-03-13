import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { MealPlanControllers } from './mealPlan.controller';
import validateRequest from '../../middlewares/validateRequest';
import { MealPlanValidation } from './mealPlan.validation';

const router = express.Router();

router
  .route('/')
  .get(MealPlanControllers.getAllMealPlan)
  .post(
    auth(USER_ROLE.mealProvider, USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(MealPlanValidation.createMealPlanValidationSchema),
    MealPlanControllers.createMealPlan,
  );

// How many recipes in a week
router.get('/week', MealPlanControllers.getMealPlanForWeek);

// All plan for a month
router.get('/monthly-plan', MealPlanControllers.getMonthlyMealPlan);

// All weeks
router.get('/recent-plan', MealPlanControllers.getCurrentAndLastMonthMealPlans);

router
  .route('/:id')
  .delete(
    auth(USER_ROLE.mealProvider, USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(MealPlanValidation.updateMealPlanValidationSchema),
    MealPlanControllers.deleteMealPlan,
  )
  .patch(
    auth(USER_ROLE.mealProvider, USER_ROLE.admin, USER_ROLE.superAdmin),
    MealPlanControllers.deleteMealPlan,
  );

export default router;
