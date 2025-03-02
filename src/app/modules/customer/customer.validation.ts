import { z } from 'zod';
import { DISTRICTS } from '../../interface/user';

const createCustomerNameValidationSchema = z.object({
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
const updateCustomerNameValidationSchema = z.object({
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

const customerAddressValidationSchema = z.object({
  street: z.string().min(5).max(50).optional(),
  city: z.string().min(3).max(30).optional(),
  district: z.enum(DISTRICTS, { message: 'Invalid district' }),
  zipCode: z.string().min(5).max(5).optional(),
});

const createCustomerValidatonSchema = z.object({
  body: z.object({
    name: createCustomerNameValidationSchema.required(),
    address: customerAddressValidationSchema.optional(),
    email: z.string().email(),
    phoneNumber: z.string().min(11).max(15),
    profileImg: z.string().optional(),
    dietaryPreferences: z.array(z.string()).optional(),
    orderHistory: z
      .array(
        z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
          message: 'Invalid ObjectId format',
        }),
      )
      .optional(),
  }),
});

const updateCustomerValidatonSchema = z.object({
  body: z.object({
    name: updateCustomerNameValidationSchema.optional(),
    address: customerAddressValidationSchema.optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().min(11).max(15).optional(),
    profileImg: z.string().optional(),
    dietaryPreferences: z.array(z.string()).optional(),
    orderHistory: z
      .array(
        z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
          message: 'Invalid ObjectId format',
        }),
      )
      .optional(),
  }),
});

export const customerValidationsSchema = {
  createCustomerValidatonSchema,
  updateCustomerValidatonSchema,
};
