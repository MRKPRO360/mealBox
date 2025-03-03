import { Router } from 'express';
import UserRouter from '../modules/user/user.routes';
import RecipeRouter from '../modules/recipe/recipe.routes';
import CustomerRouter from '../modules/customer/customer.routes';
import AuthRouter from '../modules/auth/auth.routes';

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
  {
    path: '/customers',
    route: CustomerRouter,
  },
  {
    path: '/auth',
    route: AuthRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
