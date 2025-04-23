"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidations = void 0;
const zod_1 = require("zod");
const registeredUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Name is required!' })
            .min(4, 'Name must be 4 characters long'),
        email: zod_1.z
            .string({ required_error: 'Email is required!' })
            .email('Invalid email address'),
        password: zod_1.z
            .string({ required_error: 'Password is required!' })
            .min(6, 'Password must be at least 6 characters long'),
        role: zod_1.z.enum(['user', 'admin']).optional().default('user'),
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
    }),
});
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh token is requried!',
        }),
    }),
});
// password: z.string().min(6, 'Password must be at least 6 characters long'),
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z
            .string({
            required_error: 'Old password is requried!',
        })
            .min(6, 'Password must be at least 6 characters long'),
        newPassword: zod_1.z
            .string({
            required_error: 'New password is requried!',
        })
            .min(6, 'Password must be at least 6 characters long'),
    }),
});
exports.authValidations = {
    registeredUserValidationSchema,
    loginValidationSchema,
    refreshTokenValidationSchema,
    changePasswordValidationSchema,
};
