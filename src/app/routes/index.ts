import { Router } from 'express';
import UserRouter from '../modules/user/user.routes';
import RecipeRouter from '../modules/recipe/recipe.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRouter,
  },
  {
    path: '/recipes',
    route: RecipeRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
