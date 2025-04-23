"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mealPlanSchema = new mongoose_1.Schema({
    week: { type: Date, required: true },
    selectedMeals: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Recipe' }],
}, {
    timestamps: true,
});
const MealPlan = (0, mongoose_1.model)('MealPlan', mealPlanSchema);
exports.default = MealPlan;
