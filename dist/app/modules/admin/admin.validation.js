"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidationSchema = exports.createAdminValidationSchema = exports.createAdminAddressSchema = exports.createAdminNameSchema = void 0;
const zod_1 = require("zod");
const user_1 = require("../../interface/user");
exports.createAdminNameSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .trim()
        .min(1, 'First name is required')
        .max(20, 'Name cannot be more than 20 characters'),
    lastName: zod_1.z
        .string()
        .trim()
        .min(1, 'Last name is required')
        .max(20, 'Name cannot be more than 20 characters'),
});
exports.createAdminAddressSchema = zod_1.z.object({
    street: zod_1.z.string().trim().min(3, 'Street is required'),
    city: zod_1.z.string().trim().min(3, 'City is required'),
    district: zod_1.z.enum(user_1.DISTRICTS, { message: 'Invalid district' }),
    zipCode: zod_1.z
        .string()
        .trim()
        .min(4, 'Zip code is required')
        .max(10, 'Zip code is too long'),
});
exports.createAdminValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: exports.createAdminNameSchema,
        address: exports.createAdminAddressSchema,
        email: zod_1.z.string().email('Invalid email address'),
        phoneNumber: zod_1.z
            .string()
            .trim()
            .min(10, 'Phone number must be at least 10 digits'),
        profileImg: zod_1.z.string().url('Invalid URL').optional(),
    }),
});
exports.AdminValidationSchema = {
    createAdminValidationSchema: exports.createAdminValidationSchema,
};
