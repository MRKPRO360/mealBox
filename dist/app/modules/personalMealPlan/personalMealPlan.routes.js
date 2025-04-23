"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const personalMealPlan_controller_1 = require("./personalMealPlan.controller");
const personalMealPlan_validation_1 = require("./personalMealPlan.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, auth_1.default)(user_constant_1.USER_ROLE.customer), personalMealPlan_controller_1.PersonalMealPlanControllers.getAllPersonalMealPlan)
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.customer), (0, validateRequest_1.default)(personalMealPlan_validation_1.PersonalMealPlanValidation.createPersonalMealPlanValidationSchema), personalMealPlan_controller_1.PersonalMealPlanControllers.createPersonalMealPlan);
router
    .route('/week')
    // How many recipes in a week
    .get((0, auth_1.default)(user_constant_1.USER_ROLE.customer), personalMealPlan_controller_1.PersonalMealPlanControllers.getPersonalMealPlanForWeek)
    // update a weekly plan's selected recipes and week
    // .patch(
    //   auth(USER_ROLE.customer),
    //   validateRequest(
    //     PersonalMealPlanValidation.updatePersonalMealPlanValidationSchema,
    //   ),
    //   PersonalMealPlanControllers.updateWeeklyPlan,
    // )
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.customer), personalMealPlan_controller_1.PersonalMealPlanControllers.deletePersonalMealPlanForWeek);
// REMOVE A MEAL FROM A WEEK
router.delete('/:weekId/meals/:mealId', (0, auth_1.default)(user_constant_1.USER_ROLE.customer), personalMealPlan_controller_1.PersonalMealPlanControllers.removeMealFromWeek);
// All weeks
router.get('/recent-plan', (0, auth_1.default)(user_constant_1.USER_ROLE.customer), personalMealPlan_controller_1.PersonalMealPlanControllers.getCurrentAndLastMonthPersonalMealPlans);
router.patch('/:id/weekly-plan', (0, auth_1.default)(user_constant_1.USER_ROLE.customer), (0, validateRequest_1.default)(personalMealPlan_validation_1.PersonalMealPlanValidation.updatePersonalMealPlanValidationSchema), personalMealPlan_controller_1.PersonalMealPlanControllers.updateWeeklyPlan);
// All plan for a month
router.get('/monthly-plan', (0, auth_1.default)(user_constant_1.USER_ROLE.customer), personalMealPlan_controller_1.PersonalMealPlanControllers.getMonthlyPersonalMealPlan);
router
    .route('/:id')
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.customer), personalMealPlan_controller_1.PersonalMealPlanControllers.deletePersonalMealPlan)
    .patch((0, auth_1.default)(user_constant_1.USER_ROLE.customer), (0, validateRequest_1.default)(personalMealPlan_validation_1.PersonalMealPlanValidation.updatePersonalMealPlanValidationSchema), personalMealPlan_controller_1.PersonalMealPlanControllers.updatePersonalMealPlan);
exports.default = router;
