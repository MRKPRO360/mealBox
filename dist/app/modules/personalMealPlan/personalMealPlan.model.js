"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const personalMealPlanSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    week: { type: Date, required: true },
    selectedMeals: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Recipe' }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// FILTERING OUT THE DELETED SCHEMA
personalMealPlanSchema.pre('find', function (next) {
    this.where('isDeleted', false);
    next();
});
personalMealPlanSchema.pre('findOne', function (next) {
    this.where('isDeleted', false);
    next();
});
const PersonalMealPlan = (0, mongoose_1.model)('personalMealPlan', personalMealPlanSchema);
exports.default = PersonalMealPlan;
