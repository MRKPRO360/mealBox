import { z } from 'zod';
import { CUISINE_SPECIALTIES } from './provider.constant';

const createProviderNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'First Name must start with a capital letter',
    }),
  lastName: z.string().trim(),
});
const updateProviderNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'First Name must start with a capital letter',
    }),
  lastName: z.string().trim(),
});

const ProviderAddressValidationSchema = z.object({
  street: z.string().min(5).max(50).optional(),
  city: z.string().min(3).max(30).optional(),
  state: z.string().min(2).max(2).optional(),
  zipCode: z.string().min(5).max(5).optional(),
});

const createProviderValidatonSchema = z.object({
  body: z.object({
    name: createProviderNameValidationSchema.required(),
    address: ProviderAddressValidationSchema.optional(),
    email: z.string().email(),
    phoneNumber: z.string().min(11).max(15),
    bio: z.string().min(10).max(200),
    profileImg: z.string().optional(),
    cusineSpecialties: z
      .array(
        z.enum(CUISINE_SPECIALTIES, {
          message: 'Invalid cuisine specialty!',
        }),
      )
      .optional(),
  }),
  rating: z.string().optional(),
  ratingsCount: z.string().optional(),
});

const updateProviderValidatonSchema = z.object({
  body: z.object({
    name: updateProviderNameValidationSchema.optional(),
    address: ProviderAddressValidationSchema.optional(),
    email: z.string().email().optional(),
    bio: z.string().min(10).max(200).optional(),
    phoneNumber: z.string().min(11).max(15).optional(),
    profileImg: z.string().optional(),
    cusineSpecialties: z
      .array(
        z.enum(CUISINE_SPECIALTIES, {
          message: 'Invalid cuisine specialty!',
        }),
      )
      .optional(),
    customerReviews: z
      .array(
        z.object({
          rating: z
            .string()
            .regex(/^[1-5]$/, 'Rating must be a number between 1 and 5')
            .optional(), // Ensuring it's a string representing 1-5
          review: z.string().min(1, 'Review cannot be empty').optional(),
        }),
      )
      .optional(),
    availableMealOptions: z.array(z.string()).optional(),
    orderHistory: z.array(z.string()).optional(),
    rating: z.string().optional(),
    ratingsCount: z.string().optional(),
  }),
});

export const ProviderValidationsSchema = {
  createProviderValidatonSchema,
  updateProviderValidatonSchema,
};
