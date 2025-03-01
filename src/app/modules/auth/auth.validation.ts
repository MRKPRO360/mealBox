import { z } from 'zod';

const registeredUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required!' })
      .min(4, 'Name must be 4 characters long'),
    email: z
      .string({ required_error: 'Email is required!' })
      .email('Invalid email address'),
    password: z
      .string({ required_error: 'Password is required!' })
      .min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['user', 'admin']).optional().default('user'),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is requried!',
    }),
  }),
});

// password: z.string().min(6, 'Password must be at least 6 characters long'),
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({
        required_error: 'Old password is requried!',
      })
      .min(6, 'Password must be at least 6 characters long'),
    newPassword: z
      .string({
        required_error: 'New password is requried!',
      })
      .min(6, 'Password must be at least 6 characters long'),
  }),
});

export const authValidations = {
  registeredUserValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
  changePasswordValidationSchema,
};
