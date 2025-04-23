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
exports.PersonalMealPlanControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const personalMealPlan_service_1 = require("./personalMealPlan.service");
const createPersonalMealPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield personalMealPlan_service_1.PersonalMealPlanServices.createPersonalMealPlanInDB(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Personal meal plan created successfully!',
        data: result,
    });
}));
const getPersonalMealPlanForWeek = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { week } = req.query;
    const result = yield personalMealPlan_service_1.PersonalMealPlanServices.getPersonalMealPlanForWeek(week, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Personal meal plan retrieved successfully!',
        data: result,
    });
}));
const deletePersonalMealPlanForWeek = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { week } = req.query;
    const result = yield personalMealPlan_service_1.PersonalMealPlanServices.deletePersonalMealPlanForWeek(week, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Deleted weekly personal meals successfully!',
        data: result,
    });
}));
const updateWeeklyPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get meal plan ID from request params
    const { week, selectedMeals } = req.body; // Get week and selectedMeals from request body
    const result = yield personalMealPlan_service_1.PersonalMealPlanServices.updateWeeklyPlanInDB(id, week, selectedMeals, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Weekly plan updated successfully!',
        data: result,
    });
}));
const getAllPersonalMealPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield personalMealPlan_service_1.PersonalMealPlanServices.getAllPersonalMealPlansFromDB(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Personal meal plan retrieved successfully!',
        data: result,
    });
}));
const getMonthlyPersonalMealPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield personalMealPlan_service_1.PersonalMealPlanServices.getMonthlyPersonalMealPlanFromDB(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Monthly personal meal plan retrieved successfully!',
        data: result,
    });
}));
const getCurrentAndLastMonthPersonalMealPlans = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield personalMealPlan_service_1.PersonalMealPlanServices.getCurrentAndLastMonthPersonalMealPlansFromDB(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Personal meal plan weeks retrieved successfully!',
        data: result,
    });
}));
const updatePersonalMealPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield personalMealPlan_service_1.PersonalMealPlanServices.updateSinglePersonalMealPlanFromDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Personal meal plan updated successfully!',
        data: result,
    });
}));
const deletePersonalMealPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield personalMealPlan_service_1.PersonalMealPlanServices.deletePersonalMealPlanFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Personal meal plan deleted successfully!',
        data: result,
    });
}));
const removeMealFromWeek = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { weekId, mealId } = req.params;
    console.log(weekId, mealId);
    const result = yield personalMealPlan_service_1.PersonalMealPlanServices.removeMealFromWeekFromDB(weekId, mealId, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Successfully removed meal from week!',
        data: result,
    });
}));
exports.PersonalMealPlanControllers = {
    createPersonalMealPlan,
    getAllPersonalMealPlan,
    updatePersonalMealPlan,
    deletePersonalMealPlan,
    deletePersonalMealPlanForWeek,
    removeMealFromWeek,
    getPersonalMealPlanForWeek,
    updateWeeklyPlan,
    getMonthlyPersonalMealPlan,
    getCurrentAndLastMonthPersonalMealPlans,
};
