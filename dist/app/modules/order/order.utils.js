"use strict";
// import { Types } from 'mongoose';
// import { Order } from './order.model';
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
exports.validateRecipeReviewEligibility = void 0;
const order_model_1 = require("./order.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const validateRecipeReviewEligibility = (userId, recipeId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find({
        user: userId,
        'meals.meal': recipeId,
    });
    if (!orders.length) {
        throw new AppError_1.default(403, 'You must purchase the recipe to leave a review.');
    }
    // Check if *any* instance of the recipe has a status of 'Completed'
    const hasCompletedMeal = orders.some((order) => order.meals.some((meal) => meal.meal.toString() === recipeId.toString() &&
        meal.status === 'Completed'));
    if (hasCompletedMeal)
        return true;
    // If it's purchased but all statuses are non-completed, find the exact status to return an appropriate error
    const foundMeal = orders
        .flatMap((order) => order.meals)
        .find((meal) => meal.meal.toString() === recipeId.toString());
    if (!foundMeal) {
        throw new AppError_1.default(403, 'Meal not found in your orders.');
    }
    if (foundMeal.status === 'Pending') {
        throw new AppError_1.default(403, 'You cannot review this meal until it is completed.');
    }
    if (foundMeal.status === 'Cancelled') {
        throw new AppError_1.default(403, 'You cannot review a cancelled meal.');
    }
    throw new AppError_1.default(403, 'Invalid meal status.');
});
exports.validateRecipeReviewEligibility = validateRecipeReviewEligibility;
