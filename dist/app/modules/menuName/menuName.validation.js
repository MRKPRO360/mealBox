"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuNameSchemaValidation = void 0;
const zod_1 = require("zod");
const menuName_const_1 = require("./menuName.const");
const createMenuNameSchemaValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.enum(menuName_const_1.recipeMenuNames, {
            message: 'Invalid recipe menu name',
        }),
    }),
});
const updateMenuNameSchemaValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .enum(menuName_const_1.recipeMenuNames, {
            message: 'Invalid recipe menu name',
        })
            .optional(),
    }),
});
exports.MenuNameSchemaValidation = {
    createMenuNameSchemaValidation,
    updateMenuNameSchemaValidation,
};
