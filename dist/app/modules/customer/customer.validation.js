"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerValidationsSchema = void 0;
const zod_1 = require("zod");
const user_1 = require("../../interface/user");
const customer_constant_1 = require("./customer.constant");
const createCustomerNameValidationSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .trim()
        .min(1)
        .max(20)
        .refine((value) => /^[A-Z]/.test(value), {
        message: 'First Name must start with a capital letter',
    }),
    lastName: zod_1.z.string().trim().optional(),
});
const updateCustomerNameValidationSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .trim()
        .min(1)
        .max(20)
        .refine((value) => /^[A-Z]/.test(value), {
        message: 'First Name must start with a capital letter',
    })
        .optional(),
    lastName: zod_1.z.string().trim().optional(),
});
const customerAddressValidationSchema = zod_1.z.object({
    street: zod_1.z.string().min(5).max(50).optional(),
    city: zod_1.z.enum(user_1.DIVISIONS, { message: 'Invalid city' }).optional(),
    district: zod_1.z.enum(user_1.DISTRICTS, { message: 'Invalid district' }).optional(),
    zipCode: zod_1.z.string().min(5).max(5).optional(),
});
const createCustomerValidatonSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: createCustomerNameValidationSchema,
        address: customerAddressValidationSchema.optional(),
        email: zod_1.z.string().email(),
        phoneNumber: zod_1.z.string().min(11).max(15).optional(),
        profileImg: zod_1.z.string().optional(),
        dietaryPreferences: zod_1.z
            .array(zod_1.z.enum(customer_constant_1.dietaryPreferences, {
            message: 'Invalid dietary preference!',
        }))
            .optional(),
        orderHistory: zod_1.z
            .array(zod_1.z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
            message: 'Invalid ObjectId format',
        }))
            .optional(),
    }),
});
const updateCustomerValidatonSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: updateCustomerNameValidationSchema.optional(),
        address: customerAddressValidationSchema.optional(),
        email: zod_1.z.string().email().optional(),
        phoneNumber: zod_1.z.string().min(11).max(15).optional(),
        profileImg: zod_1.z.string().optional(),
        dietaryPreferences: zod_1.z
            .array(zod_1.z.enum(customer_constant_1.dietaryPreferences, {
            message: 'Invalid dietary preference!',
        }))
            .optional(),
        orderHistory: zod_1.z
            .array(zod_1.z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
            message: 'Invalid ObjectId format',
        }))
            .optional(),
        selectedMeals: zod_1.z
            .array(zod_1.z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
            message: 'Invalid ObjectId format',
        }))
            .optional(),
    }),
});
exports.customerValidationsSchema = {
    createCustomerValidatonSchema,
    updateCustomerValidatonSchema,
};
