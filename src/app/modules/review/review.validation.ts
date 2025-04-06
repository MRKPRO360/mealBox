import { z } from 'zod';

const createReviewValidationSchema = z.object({
  body: z.object({
    targetType: z.enum(['recipe', 'provider']), // Enum validation for 'recipe' or 'provider'
    targetId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid targetId format')
      .nonempty(), // ObjectId format validation
    rating: z
      .number()
      .min(1, 'Rating must be between 1 and 5')
      .max(5, 'Rating must be between 1 and 5'), // Rating between 1 and 5
    comment: z.string().optional(),
  }),
});

const updateReviewValidationSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .min(1, 'Rating must be between 1 and 5')
      .max(5, 'Rating must be between 1 and 5')
      .optional(), // Rating between 1 and 5
    comment: z.string().optional(),
  }),
});

export const ReviewValidation = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
};
