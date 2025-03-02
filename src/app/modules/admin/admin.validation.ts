import { z } from 'zod';
import { DISTRICTS } from '../../interface/user';

export const createAdminNameSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(20, 'Name cannot be more than 20 characters'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(20, 'Name cannot be more than 20 characters'),
});

export const createAdminAddressSchema = z.object({
  street: z.string().trim().min(3, 'Street is required'),
  city: z.string().trim().min(3, 'City is required'),
  district: z.enum(DISTRICTS, { message: 'Invalid district' }),
  zipCode: z
    .string()
    .trim()
    .min(4, 'Zip code is required')
    .max(10, 'Zip code is too long'),
});

export const createAdminValidationSchema = z.object({
  body: z.object({
    name: createAdminNameSchema,
    address: createAdminAddressSchema,
    email: z.string().email('Invalid email address'),
    phoneNumber: z
      .string()
      .trim()
      .min(10, 'Phone number must be at least 10 digits'),
    profileImg: z.string().url('Invalid URL').optional(),
  }),
});

export const AdminValidationSchema = {
  createAdminValidationSchema,
};
