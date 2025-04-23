"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalMealPlanValidation = void 0;
const zod_1 = require("zod");
const createPersonalMealPlanValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        week: zod_1.z.string(),
        selectedMeals: zod_1.z.array(zod_1.z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
            message: 'Invalid ObjectId format',
        })),
    }),
});
const updatePersonalMealPlanValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        week: zod_1.z.string().optional(),
        selectedMeals: zod_1.z
            .array(zod_1.z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
            message: 'Invalid ObjectId format',
        }))
            .optional(),
    }),
});
exports.PersonalMealPlanValidation = {
    createPersonalMealPlanValidationSchema,
    updatePersonalMealPlanValidationSchema,
};
