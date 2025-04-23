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
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const recipe_model_1 = __importDefault(require("../recipe/recipe.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const orderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    meals: [
        {
            meal: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Recipe',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            selectedSize: {
                type: String,
                enum: ['small', 'medium', 'large'],
                required: true,
            },
            status: {
                type: String,
                enum: ['Pending', 'Completed', 'Cancelled'],
                default: 'Pending',
            },
            spiceLevel: { type: String }, // "mild", "medium", "hot", etc
            dietaryPreferences: [{ type: String }], // ["vegan", "gluten-free"]
            ingredientChanges: [{ type: String }],
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    deliveryCharge: {
        type: Number,
        default: 0,
    },
    finalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'Online', 'Card'],
        default: 'Online',
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Canecelled'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});
// Pre-save hook to calculate total, discount, delivery charge, and final price
orderSchema.pre('validate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // Step 1: Initialize total amount
        let totalAmount = 0;
        // Step 2: Calculate total amount for products
        for (const mealItem of this.meals) {
            const meal = yield recipe_model_1.default.findById(mealItem.meal);
            if (!meal) {
                throw new AppError_1.default(404, `Meal with ID ${mealItem.meal} not found`);
            }
            // Get the price from the selected portion size
            const selectedPortion = meal.portionSizes[mealItem.selectedSize];
            if (!selectedPortion) {
                throw new Error(`Selected portion size not found for meal ${mealItem.meal}`);
            }
            totalAmount += Number(selectedPortion.price) * mealItem.quantity;
        }
        const isDhaka = (_b = (_a = this === null || this === void 0 ? void 0 : this.shippingAddress) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes('dhaka');
        const deliveryCharge = isDhaka ? 5 : 10;
        this.totalAmount = totalAmount;
        this.deliveryCharge = deliveryCharge;
        this.finalAmount = totalAmount + deliveryCharge;
        next();
    });
});
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
