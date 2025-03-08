import { z } from 'zod';
import { recipeMenuNames } from './menuName.const';

const createMenuNameSchemaValidation = z.object({
  menuName: z.enum(recipeMenuNames, {
    message: 'Invalid recipe menu name',
  }),
  menuImg: z.string().min(1, { message: 'Recipe menu image is required' }),
});

const updateMenuNameSchemaValidation = z.object({
  menuName: z
    .enum(recipeMenuNames, {
      message: 'Invalid recipe menu name',
    })
    .optional(),
  menuImg: z
    .string()
    .min(1, { message: 'Recipe menu image is required' })
    .optional(),
});

export const MenuNameSchemaValidation = {
  createMenuNameSchemaValidation,
  updateMenuNameSchemaValidation,
};
