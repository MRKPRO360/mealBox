"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealPlanControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const mealPlan_service_1 = require("./mealPlan.service");
const createMealPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const MealPlan = yield mealPlan_service_1.MealPlanServices.createMealPlanInDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Meal plan created successfully!',
        data: MealPlan,
    });
}));
const removeMealFromWeek = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { weekId, mealId } = req.params;
    console.log(weekId, mealId);
    const result = yield mealPlan_service_1.MealPlanServices.removeMealFromWeekFromDB(weekId, mealId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Successfully removed meal from week!',
        data: result,
    });
}));
const getMealPlanForWeek = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { week } = req.query;
    const mealPlan = yield mealPlan_service_1.MealPlanServices.getMealPlanForWeek(week);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Meal plan retrieved successfully!',
        data: mealPlan,
    });
}));
const getAllMealPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const MealPlan = yield mealPlan_service_1.MealPlanServices.getAllMealPlansFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Meal plan retrieved successfully!',
        data: MealPlan,
    });
}));
const getMonthlyMealPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const MealPlan = yield mealPlan_service_1.MealPlanServices.getMonthlyMealPlanFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Monthly meal plan retrieved successfully!',
        data: MealPlan,
    });
}));
const getCurrentAndLastMonthMealPlans = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const MealPlan = yield mealPlan_service_1.MealPlanServices.getCurrentAndLastMonthMealPlansFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Meal plan weeks retrieved successfully!',
        data: MealPlan,
    });
}));
const updateMealPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const MealPlan = yield mealPlan_service_1.MealPlanServices.updateSingleMealPlanFromDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Meal plan updated successfully!',
        data: MealPlan,
    });
}));
const updateWeeklyPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get meal plan ID from request params
    const { week, selectedMeals } = req.body; // Get week and selectedMeals from request body
    const result = yield mealPlan_service_1.MealPlanServices.updateWeeklyPlanInDB(id, week, selectedMeals);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Weekly plan updated successfully!',
        data: result,
    });
}));
const deleteMealPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const MealPlan = yield mealPlan_service_1.MealPlanServices.deleteMealPlanFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Meal plan deleted successfully!',
        data: MealPlan,
    });
}));
const deleteMealPlanForWeek = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { week } = req.query;
    const result = yield mealPlan_service_1.MealPlanServices.deleteMealPlanForWeek(week);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Deleted weekly personal meals successfully!',
        data: result,
    });
}));
exports.MealPlanControllers = {
    createMealPlan,
    getAllMealPlan,
    updateMealPlan,
    updateWeeklyPlan,
    deleteMealPlan,
    deleteMealPlanForWeek,
    removeMealFromWeek,
    getMealPlanForWeek,
    getMonthlyMealPlan,
    getCurrentAndLastMonthMealPlans,
};
