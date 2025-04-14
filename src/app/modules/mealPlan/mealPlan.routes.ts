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
    auth(USER_ROLE.provider, USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(MealPlanValidation.createMealPlanValidationSchema),
    MealPlanControllers.createMealPlan,
  );

router
  .route('/week')
  // How many recipes in a week
  .get(MealPlanControllers.getMealPlanForWeek)

  .delete(auth(USER_ROLE.admin), MealPlanControllers.deleteMealPlanForWeek);

router.patch(
  '/:id/weekly-plan',
  auth(USER_ROLE.admin),
  validateRequest(MealPlanValidation.updateMealPlanValidationSchema),
  MealPlanControllers.updateWeeklyPlan,
);

// REMOVE A MEAL FROM A WEEK
router.delete(
  '/:weekId/meals/:mealId',
  auth(USER_ROLE.admin),
  MealPlanControllers.removeMealFromWeek,
);

// All plan for a month
router.get('/monthly-plan', MealPlanControllers.getMonthlyMealPlan);

// All weeks
router.get('/recent-plan', MealPlanControllers.getCurrentAndLastMonthMealPlans);

router
  .route('/:id')
  .delete(
    auth(USER_ROLE.provider, USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(MealPlanValidation.updateMealPlanValidationSchema),
    MealPlanControllers.deleteMealPlan,
  )
  .patch(
    auth(USER_ROLE.provider, USER_ROLE.admin, USER_ROLE.superAdmin),
    MealPlanControllers.updateMealPlan,
  );

export default router;
