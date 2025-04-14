import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { PersonalMealPlanControllers } from './personalMealPlan.controller';
import { PersonalMealPlanValidation } from './personalMealPlan.validation';

const router = express.Router();

router
  .route('/')
  .get(
    auth(USER_ROLE.customer),
    PersonalMealPlanControllers.getAllPersonalMealPlan,
  )
  .post(
    auth(USER_ROLE.customer),
    validateRequest(
      PersonalMealPlanValidation.createPersonalMealPlanValidationSchema,
    ),
    PersonalMealPlanControllers.createPersonalMealPlan,
  );

router
  .route('/week')
  // How many recipes in a week
  .get(
    auth(USER_ROLE.customer),
    PersonalMealPlanControllers.getPersonalMealPlanForWeek,
  )
  // update a weekly plan's selected recipes and week
  // .patch(
  //   auth(USER_ROLE.customer),
  //   validateRequest(
  //     PersonalMealPlanValidation.updatePersonalMealPlanValidationSchema,
  //   ),
  //   PersonalMealPlanControllers.updateWeeklyPlan,
  // )

  .delete(
    auth(USER_ROLE.customer),
    PersonalMealPlanControllers.deletePersonalMealPlanForWeek,
  );

// REMOVE A MEAL FROM A WEEK
router.delete(
  '/:weekId/meals/:mealId',
  auth(USER_ROLE.customer),
  PersonalMealPlanControllers.removeMealFromWeek,
);

// All weeks
router.get(
  '/recent-plan',
  auth(USER_ROLE.customer),
  PersonalMealPlanControllers.getCurrentAndLastMonthPersonalMealPlans,
);

router.patch(
  '/:id/weekly-plan',
  auth(USER_ROLE.customer),
  validateRequest(
    PersonalMealPlanValidation.updatePersonalMealPlanValidationSchema,
  ),
  PersonalMealPlanControllers.updateWeeklyPlan,
);

// All plan for a month
router.get(
  '/monthly-plan',
  auth(USER_ROLE.customer),
  PersonalMealPlanControllers.getMonthlyPersonalMealPlan,
);

router
  .route('/:id')
  .delete(
    auth(USER_ROLE.customer),
    PersonalMealPlanControllers.deletePersonalMealPlan,
  )
  .patch(
    auth(USER_ROLE.customer),
    validateRequest(
      PersonalMealPlanValidation.updatePersonalMealPlanValidationSchema,
    ),
    PersonalMealPlanControllers.updatePersonalMealPlan,
  );

export default router;
