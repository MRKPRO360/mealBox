"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
const createReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        targetType: zod_1.z.enum(['recipe', 'provider']), // Enum validation for 'recipe' or 'provider'
        targetId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid targetId format')
            .nonempty(), // ObjectId format validation
        rating: zod_1.z
            .number()
            .min(1, 'Rating must be between 1 and 5')
            .max(5, 'Rating must be between 1 and 5'), // Rating between 1 and 5
        comment: zod_1.z.string().optional(),
    }),
});
const updateReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z
            .number()
            .min(1, 'Rating must be between 1 and 5')
            .max(5, 'Rating must be between 1 and 5')
            .optional(), // Rating between 1 and 5
        comment: zod_1.z.string().optional(),
    }),
});
exports.ReviewValidation = {
    createReviewValidationSchema,
    updateReviewValidationSchema,
};
