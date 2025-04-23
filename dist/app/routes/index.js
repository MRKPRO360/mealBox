"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("../modules/user/user.routes"));
const recipe_routes_1 = __importDefault(require("../modules/recipe/recipe.routes"));
const customer_routes_1 = __importDefault(require("../modules/customer/customer.routes"));
const provider_routes_1 = __importDefault(require("../modules/provider/provider.routes"));
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const menuName_routes_1 = __importDefault(require("../modules/menuName/menuName.routes"));
const mealPlan_routes_1 = __importDefault(require("../modules/mealPlan/mealPlan.routes"));
const personalMealPlan_routes_1 = __importDefault(require("../modules/personalMealPlan/personalMealPlan.routes"));
const order_routes_1 = __importDefault(require("../modules/order/order.routes"));
const review_routes_1 = __importDefault(require("../modules/review/review.routes"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/recipes',
        route: recipe_routes_1.default,
    },
    {
        path: '/menu-names',
        route: menuName_routes_1.default,
    },
    {
        path: '/meal-plans',
        route: mealPlan_routes_1.default,
    },
    {
        path: '/personal-meal-plans',
        route: personalMealPlan_routes_1.default,
    },
    {
        path: '/users',
        route: user_routes_1.default,
    },
    {
        path: '/customers',
        route: customer_routes_1.default,
    },
    {
        path: '/providers',
        route: provider_routes_1.default,
    },
    {
        path: '/auth',
        route: auth_routes_1.default,
    },
    {
        path: '/orders',
        route: order_routes_1.default,
    },
    {
        path: '/reviews',
        route: review_routes_1.default,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
