"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderValidationsSchema = void 0;
const zod_1 = require("zod");
const provider_constant_1 = require("./provider.constant");
const createProviderNameValidationSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .trim()
        .min(1)
        .max(20)
        .refine((value) => /^[A-Z]/.test(value), {
        message: 'First Name must start with a capital letter',
    }),
    lastName: zod_1.z.string().trim(),
});
const updateProviderNameValidationSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .trim()
        .min(1)
        .max(20)
        .refine((value) => /^[A-Z]/.test(value), {
        message: 'First Name must start with a capital letter',
    }),
    lastName: zod_1.z.string().trim(),
});
const ProviderAddressValidationSchema = zod_1.z.object({
    street: zod_1.z.string().min(5).max(50).optional(),
    city: zod_1.z.string().min(3).max(30).optional(),
    state: zod_1.z.string().min(2).max(2).optional(),
    zipCode: zod_1.z.string().min(5).max(5).optional(),
});
const createProviderValidatonSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: createProviderNameValidationSchema.required(),
        address: ProviderAddressValidationSchema.optional(),
        email: zod_1.z.string().email(),
        phoneNumber: zod_1.z.string().min(11).max(15),
        bio: zod_1.z.string().min(10).max(200),
        profileImg: zod_1.z.string().optional(),
        cusineSpecialties: zod_1.z
            .array(zod_1.z.enum(provider_constant_1.CUISINE_SPECIALTIES, {
            message: 'Invalid cuisine specialty!',
        }))
            .optional(),
    }),
    rating: zod_1.z.string().optional(),
    ratingsCount: zod_1.z.string().optional(),
});
const updateProviderValidatonSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: updateProviderNameValidationSchema.optional(),
        address: ProviderAddressValidationSchema.optional(),
        email: zod_1.z.string().email().optional(),
        bio: zod_1.z.string().min(10).max(200).optional(),
        phoneNumber: zod_1.z.string().min(11).max(15).optional(),
        profileImg: zod_1.z.string().optional(),
        cusineSpecialties: zod_1.z
            .array(zod_1.z.enum(provider_constant_1.CUISINE_SPECIALTIES, {
            message: 'Invalid cuisine specialty!',
        }))
            .optional(),
        customerReviews: zod_1.z
            .array(zod_1.z.object({
            rating: zod_1.z
                .string()
                .regex(/^[1-5]$/, 'Rating must be a number between 1 and 5')
                .optional(), // Ensuring it's a string representing 1-5
            review: zod_1.z.string().min(1, 'Review cannot be empty').optional(),
        }))
            .optional(),
        availableMealOptions: zod_1.z.array(zod_1.z.string()).optional(),
        orderHistory: zod_1.z.array(zod_1.z.string()).optional(),
        rating: zod_1.z.string().optional(),
        ratingsCount: zod_1.z.string().optional(),
    }),
});
exports.ProviderValidationsSchema = {
    createProviderValidatonSchema,
    updateProviderValidatonSchema,
};
