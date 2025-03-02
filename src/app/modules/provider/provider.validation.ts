import { z } from 'zod';

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
    profileImg: z.string().optional(),
  }),
});

const updateProviderValidatonSchema = z.object({
  body: z.object({
    name: updateProviderNameValidationSchema.optional(),
    address: ProviderAddressValidationSchema.optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().min(11).max(15).optional(),
    profileImg: z.string().optional(),
  }),
});

export const ProviderValidationsSchema = {
  createProviderValidatonSchema,
  updateProviderValidatonSchema,
};
