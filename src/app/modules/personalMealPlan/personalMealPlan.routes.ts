import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { PersonalMealPlanControllers } from './personalMealPlan.controller';
import { PersonalMealPlanValidation } from './personalMealPlan.validation';

const router = express.Router();

router
  .route('/')
  .get(PersonalMealPlanControllers.getAllPersonalMealPlan)
  .post(
    auth(USER_ROLE.customer),
    validateRequest(
      PersonalMealPlanValidation.createPersonalMealPlanValidationSchema,
    ),
    PersonalMealPlanControllers.createPersonalMealPlan,
  );

// How many recipes in a week
router.get('/week', PersonalMealPlanControllers.getPersonalMealPlanForWeek);

// All plan for a month
router.get(
  '/monthly-plan',
  PersonalMealPlanControllers.getMonthlyPersonalMealPlan,
);

// All weeks
router.get(
  '/recent-plan',
  PersonalMealPlanControllers.getCurrentAndLastMonthPersonalMealPlans,
);

router
  .route('/:id')
  .delete(
    auth(USER_ROLE.customer),
    validateRequest(
      PersonalMealPlanValidation.updatePersonalMealPlanValidationSchema,
    ),
    PersonalMealPlanControllers.deletePersonalMealPlan,
  )
  .patch(
    auth(USER_ROLE.customer),
    PersonalMealPlanControllers.updatePersonalMealPlan,
  );

export default router;
