"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const recipe_constant_1 = require("./recipe.constant");
// Define the Ingredient schema
const ingredientSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    contains: { type: [String], default: [] }, // Optional field for allergens
});
// Define the NutritionValues schema
const nutritionValuesSchema = new mongoose_1.Schema({
    calories: { type: String },
    fat: { type: String },
    saturatedFat: { type: String },
    carbohydrate: { type: String },
    sugar: { type: String },
    dietaryFiber: { type: String },
    protein: { type: String },
    cholesterol: { type: String },
    sodium: { type: String },
});
// Define the Instruction schema
const instructionSchema = new mongoose_1.Schema({
    step: { type: Number, required: true },
    description: { type: String, required: true },
});
// Define the Recipe schema
const recipeSchema = new mongoose_1.Schema({
    recipeName: { type: String, required: true },
    recipeImage: { type: String, required: true },
    recipeMenuName: { type: mongoose_1.Schema.ObjectId, ref: 'MenuName', required: true },
    providerId: { type: mongoose_1.Schema.ObjectId, ref: 'Provider', required: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true },
    allergens: { type: [String], required: true },
    totalTime: { type: String, required: true },
    prepTime: { type: String, required: true },
    difficulty: { type: String, enum: recipe_constant_1.DIFFICULTIES, required: true },
    ingredients: { type: [ingredientSchema], required: true },
    nutritionValues: { type: nutritionValuesSchema },
    utensils: { type: [String], required: true },
    instructions: { type: [instructionSchema], required: true },
    isDeleted: { type: Boolean, default: false }, // Optional field for soft delete functionality, default to false for active records.
    inStock: { type: Boolean, default: true },
    quantity: { type: String, required: true },
    rating: { type: Number, default: 3 }, // Range: 1-5 stars.
    ratingsCount: { type: Number, default: 0 },
    portionSizes: {
        small: {
            price: String,
            servings: String,
        },
        medium: { price: String, servings: String },
        large: { price: String, servings: String },
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
// FILTERING OUT THE DELETED RECIPE
recipeSchema.pre('find', function (next) {
    // this.model
    //   .updateMany(
    //     { isDeleted: { $ne: true } },
    //     {
    //       $unset: { pricePerServing: '', servings: '' },
    //     },
    //     { multi: true }, // Update all matching documents
    //   )
    //   .exec();
    // this.model.updateMany({}, [
    //   {
    //     $set: {
    //       rating: { $toDouble: '$rating' },
    //       ratingsCount: { $toDouble: '$ratingsCount' },
    //       createdAt: { $toDate: '$createdAt' },
    //     },
    //   },
    // ]);
    this.where('isDeleted', false);
    next();
});
recipeSchema.pre('findOne', function (next) {
    this.where('isDeleted', false);
    next();
});
// virtual populating
recipeSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'targetId',
    localField: '_id',
    options: { match: { targetType: 'recipe' } },
});
const Recipe = (0, mongoose_1.model)('Recipe', recipeSchema);
exports.default = Recipe;
