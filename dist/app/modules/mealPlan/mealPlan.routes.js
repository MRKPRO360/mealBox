"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const mealPlan_controller_1 = require("./mealPlan.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const mealPlan_validation_1 = require("./mealPlan.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(mealPlan_controller_1.MealPlanControllers.getAllMealPlan)
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.provider, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(mealPlan_validation_1.MealPlanValidation.createMealPlanValidationSchema), mealPlan_controller_1.MealPlanControllers.createMealPlan);
router
    .route('/week')
    // How many recipes in a week
    .get(mealPlan_controller_1.MealPlanControllers.getMealPlanForWeek)
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.admin), mealPlan_controller_1.MealPlanControllers.deleteMealPlanForWeek);
router.patch('/:id/weekly-plan', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(mealPlan_validation_1.MealPlanValidation.updateMealPlanValidationSchema), mealPlan_controller_1.MealPlanControllers.updateWeeklyPlan);
// REMOVE A MEAL FROM A WEEK
router.delete('/:weekId/meals/:mealId', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), mealPlan_controller_1.MealPlanControllers.removeMealFromWeek);
// All plan for a month
router.get('/monthly-plan', mealPlan_controller_1.MealPlanControllers.getMonthlyMealPlan);
// All weeks
router.get('/recent-plan', mealPlan_controller_1.MealPlanControllers.getCurrentAndLastMonthMealPlans);
router
    .route('/:id')
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.provider, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(mealPlan_validation_1.MealPlanValidation.updateMealPlanValidationSchema), mealPlan_controller_1.MealPlanControllers.deleteMealPlan)
    .patch((0, auth_1.default)(user_constant_1.USER_ROLE.provider, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), mealPlan_controller_1.MealPlanControllers.updateMealPlan);
exports.default = router;
