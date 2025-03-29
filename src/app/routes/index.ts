import { Router } from 'express';
import UserRouter from '../modules/user/user.routes';
import RecipeRouter from '../modules/recipe/recipe.routes';
import CustomerRouter from '../modules/customer/customer.routes';
import ProviderRouter from '../modules/provider/provider.routes';
import AuthRouter from '../modules/auth/auth.routes';
import MenuNameRouter from '../modules/menuName/menuName.routes';
import MealPlanRouter from '../modules/mealPlan/mealPlan.routes';
import PersonalMealPlanRouter from '../modules/personalMealPlan/personalMealPlan.routes';
import OrderRouter from '../modules/order/order.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/recipes',
    route: RecipeRouter,
  },
  {
    path: '/menu-names',
    route: MenuNameRouter,
  },
  {
    path: '/meal-plans',
    route: MealPlanRouter,
  },
  {
    path: '/personal-meal-plans',
    route: PersonalMealPlanRouter,
  },
  {
    path: '/users',
    route: UserRouter,
  },
  {
    path: '/customers',
    route: CustomerRouter,
  },
  {
    path: '/providers',
    route: ProviderRouter,
  },
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/orders',
    route: OrderRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
