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
exports.ReviewServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const customer_model_1 = __importDefault(require("../customer/customer.model"));
const order_model_1 = require("../order/order.model");
const recipe_model_1 = __importDefault(require("../recipe/recipe.model"));
const review_model_1 = __importDefault(require("./review.model"));
const order_utils_1 = require("../order/order.utils");
// const checkReviewEleigibilityFromDB = async (payload: {
//   targetId: Types.ObjectId;
//   targetType: 'recipe' | 'provider';
//   userId: Types.ObjectId;
// }) => {
//   const customer = await Customer.findOne({ user: payload.userId });
//   if (!customer)
//     throw new AppError(403, 'Only customers can leave a recipe review!');
//   let eligible = false;
//   let alreadyReviewed = false;
//   // CHECK IF ALREADY REVIEWED
//   const existing = await Review.findOne({
//     userId: payload.userId,
//     targetId: payload.targetId,
//     targetType: payload.targetType,
//   });
//   alreadyReviewed = !!existing;
//   // PURCHASE CHECK
//   if (payload.targetType === 'recipe') {
//     eligible = await hasCustomerPurchasedRecipe(
//       payload.userId,
//       payload.targetId,
//     );
//   } else if (payload.targetType === 'provider') {
//     const orders = await Order.find({
//       user: payload.userId,
//       'meals.status': 'Completed',
//     });
//     const completedMealIds = orders.flatMap((order) =>
//       order.meals
//         .filter((meal) => meal.status === 'Completed')
//         .map((meal) => meal.meal.toString()),
//     );
//     const mealFromProvider = await Recipe.findOne({
//       _id: { $in: completedMealIds },
//       providerId: payload.targetId,
//     });
//     if (!mealFromProvider)
//       throw new AppError(
//         403,
//         'You can only review a provider you have ordered from.',
//       );
//     else {
//       eligible = true;
//     }
//   }
//   return {
//     eligibleToReview: eligible,
//     alreadyReviewed,
//   };
// };
const checkReviewEleigibilityFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield customer_model_1.default.findOne({ user: payload.userId });
    if (!customer)
        throw new AppError_1.default(403, 'Only customers can leave a recipe review!');
    let eligible = false;
    let alreadyReviewed = false;
    // Check if already reviewed
    const existing = yield review_model_1.default.findOne({
        userId: payload.userId,
        targetId: payload.targetId,
        targetType: payload.targetType,
    });
    alreadyReviewed = !!existing;
    if (payload.targetType === 'recipe') {
        yield (0, order_utils_1.validateRecipeReviewEligibility)(payload.userId, payload.targetId);
        eligible = true;
    }
    else if (payload.targetType === 'provider') {
        const orders = yield order_model_1.Order.find({
            user: payload.userId,
            'meals.status': 'Completed',
        });
        const completedMealIds = orders.flatMap((order) => order.meals
            .filter((meal) => meal.status === 'Completed')
            .map((meal) => meal.meal.toString()));
        const mealFromProvider = yield recipe_model_1.default.findOne({
            _id: { $in: completedMealIds },
            providerId: payload.targetId,
        });
        if (!mealFromProvider) {
            throw new AppError_1.default(403, 'You can only review a provider you have ordered from.');
        }
        else {
            eligible = true;
        }
    }
    return {
        eligibleToReview: eligible,
        alreadyReviewed,
    };
});
const getAllReviewsForRecipesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield review_model_1.default.find({ targetType: 'recipe' })
        .populate({
        path: 'userId',
        select: 'name email',
        populate: {
            path: 'customer',
            select: 'profileImg',
        },
    })
        .lean();
});
const getAllReviewsForProvidersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield review_model_1.default.find({ targetType: 'provider' })
        .populate({
        path: 'userId',
        select: 'name email',
        populate: {
            path: 'customer',
            select: 'profileImg',
        },
    })
        .lean();
});
const createReviewInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield customer_model_1.default.findOne({ user: payload.userId });
    if (!customer)
        throw new AppError_1.default(403, 'Only customers can leave a recipe review!');
    if (payload.targetType === 'recipe') {
        yield (0, order_utils_1.validateRecipeReviewEligibility)(payload.userId, payload.targetId);
    }
    else if (payload.targetType === 'provider') {
        const orders = yield order_model_1.Order.find({
            user: payload.userId,
            'meals.status': 'Completed',
        });
        const completedMealIds = orders.flatMap((order) => order.meals
            .filter((meal) => meal.status === 'Completed')
            .map((meal) => meal.meal.toString()));
        const mealFromProvider = yield recipe_model_1.default.findOne({
            _id: { $in: completedMealIds },
            providerId: payload.targetId,
        });
        if (!mealFromProvider)
            throw new AppError_1.default(403, 'You can only review a provider you have ordered from.');
    }
    return yield review_model_1.default.create(payload);
});
const updateReviewInDB = (payload, reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield review_model_1.default.findByIdAndUpdate(reviewId, payload, {
        new: true,
    });
});
const deleteReviewFromDB = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield review_model_1.default.findByIdAndDelete(reviewId);
});
exports.ReviewServices = {
    checkReviewEleigibilityFromDB,
    createReviewInDB,
    getAllReviewsForRecipesFromDB,
    getAllReviewsForProvidersFromDB,
    updateReviewInDB,
    deleteReviewFromDB,
};
