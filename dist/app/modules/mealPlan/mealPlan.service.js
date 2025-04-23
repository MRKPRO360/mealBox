"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.MealPlanServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const recipe_model_1 = __importDefault(require("../recipe/recipe.model"));
const mealPlan_model_1 = __importDefault(require("./mealPlan.model"));
const createMealPlanInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF THERE's ANY WEEK PREVIOUSLY ASSIGNED!
    const isWeekExist = yield mealPlan_model_1.default.findOne({ week: payload.week });
    if (isWeekExist)
        throw new AppError_1.default(400, 'Meal plan already assigned for this week!');
    const mealIds = payload.selectedMeals;
    // Step 1: Check if all meal IDs are valid (exist in the Recipe collection)
    const validMeals = yield recipe_model_1.default.find({ _id: { $in: mealIds } });
    // If the number of valid meals doesn't match the number of provided meals, there's an invalid ID
    if (validMeals.length !== mealIds.length) {
        throw new AppError_1.default(400, 'One or more meal IDs are invalid');
    }
    // Step 2: Validate the date (Only allow 7, 14, 21, 28)
    const newWeek = new Date(payload.week);
    const allowedDates = [1, 8, 15, 22];
    if (!allowedDates.includes(newWeek.getDate())) {
        throw new AppError_1.default(400, 'Meal plans can only be created for the 1th, 8th, 15st, or 22th of the month.');
    }
    // Find the most recent meal plan
    const latestMealPlan = yield mealPlan_model_1.default.findOne().sort({ week: -1 });
    if (latestMealPlan) {
        // Calculate the difference in days
        const lastWeek = new Date(latestMealPlan.week);
        const newWeek = new Date(payload.week);
        const diffInDays = (newWeek.getTime() - lastWeek.getTime()) / (1000 * 60 * 60 * 24);
        // Validate the difference should be exactly 7 days
        if (diffInDays < 6) {
            throw new AppError_1.default(400, 'Each meal plan week should be exactly 7 days apart.');
        }
    }
    return yield mealPlan_model_1.default.create(payload);
});
const getMealPlanForWeek = (week) => __awaiter(void 0, void 0, void 0, function* () {
    if (!week)
        new AppError_1.default(400, 'Week is not provided');
    return yield mealPlan_model_1.default.findOne({ week }).populate('selectedMeals');
});
const getMonthlyMealPlanFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentMonth = new Date().getMonth() + 1; // Get current month (1-based index)
    const mealPlans = yield exports.MealPlanServices.getAllMealPlansFromDB();
    // Filter only the meal plans in the current month
    const filteredPlans = mealPlans.filter((plan) => {
        const planMonth = new Date(plan.week).getMonth() + 1; // Convert week date to month
        return planMonth === currentMonth;
    });
    return filteredPlans;
});
const getAllMealPlansFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield mealPlan_model_1.default.find({}).populate('selectedMeals');
});
const getCurrentAndLastMonthMealPlansFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-based index (March = 2)
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January case
    const currentYear = today.getFullYear();
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear; // Handle December case
    const mealPlans = yield mealPlan_model_1.default.find({
        $or: [
            {
                week: {
                    $gte: new Date(currentYear, currentMonth, 1),
                    $lt: new Date(currentYear, currentMonth + 1, 1),
                },
            },
            {
                week: {
                    $gte: new Date(lastMonthYear, lastMonth, 1),
                    $lt: new Date(lastMonthYear, lastMonth + 1, 1),
                },
            },
        ],
    }).sort({ week: 1 }); // Sorting by week in ascending order
    return mealPlans;
});
const removeMealFromWeekFromDB = (weekId, mealId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!weekId || !mealId) {
        throw new AppError_1.default(400, 'Week ID or Meal ID is missing.');
    }
    const updatedMealPlan = yield mealPlan_model_1.default.findOneAndUpdate({ week: weekId }, // Ensure the meal plan belongs to the user
    { $pull: { selectedMeals: mealId } }, // Remove meal from array
    { new: true });
    if (!updatedMealPlan)
        throw new AppError_1.default(400, 'Meal plan not found or unauthorized.');
    return updatedMealPlan;
});
const deleteMealPlanForWeek = (week) => __awaiter(void 0, void 0, void 0, function* () {
    if (!week)
        throw new AppError_1.default(400, 'Week is not provided');
    const personalMealPlanForWeek = yield mealPlan_model_1.default.findOneAndUpdate({ week }, {
        isDeleted: true,
    }, {
        new: true,
        runValidators: true,
    }).lean();
    if (!personalMealPlanForWeek)
        throw new AppError_1.default(404, 'Meal plan not found'); // ✅ Ensure a document is found
    return personalMealPlanForWeek;
});
const updateSingleMealPlanFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield mealPlan_model_1.default.findByIdAndUpdate(id, payload);
});
const deleteMealPlanFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new AppError_1.default(400, 'Week is not provided');
    return yield mealPlan_model_1.default.findByIdAndUpdate(id, {
        isDeleted: true,
    }, {
        new: true,
        runValidators: true,
    }).lean();
});
const updateWeeklyPlanInDB = (mealPlanId, week, selectedMeals) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if another meal plan already exists with the same week (excluding the current one) MEANS UPDATING OTHER WEEKLY PLAN
    const existingPlan = yield mealPlan_model_1.default.findOne({
        week,
        _id: mealPlanId,
    });
    if (!existingPlan)
        throw new AppError_1.default(400, 'A meal plan for this week already exists ):');
    const updatedMealPlan = yield mealPlan_model_1.default.findByIdAndUpdate(mealPlanId, { week, selectedMeals }, { new: true, runValidators: true });
    if (!updatedMealPlan) {
        throw new AppError_1.default(400, 'Meal plan not found ):');
    }
    return updatedMealPlan;
});
exports.MealPlanServices = {
    createMealPlanInDB,
    removeMealFromWeekFromDB,
    getAllMealPlansFromDB,
    getCurrentAndLastMonthMealPlansFromDB,
    updateSingleMealPlanFromDB,
    updateWeeklyPlanInDB,
    deleteMealPlanFromDB,
    deleteMealPlanForWeek,
    getMealPlanForWeek,
    getMonthlyMealPlanFromDB,
};
