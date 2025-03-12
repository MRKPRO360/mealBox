import { z } from 'zod';
import { recipeMenuNames } from './menuName.const';

const createMenuNameSchemaValidation = z.object({
  body: z.object({
    name: z.enum(recipeMenuNames, {
      message: 'Invalid recipe menu name',
    }),
  }),
});

const updateMenuNameSchemaValidation = z.object({
  body: z.object({
    name: z
      .enum(recipeMenuNames, {
        message: 'Invalid recipe menu name',
      })
      .optional(),
  }),
});

export const MenuNameSchemaValidation = {
  createMenuNameSchemaValidation,
  updateMenuNameSchemaValidation,
};
