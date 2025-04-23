"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
router
    .route('/')
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.customer), order_controller_1.OrderController.createOrder)
    .get((0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), order_controller_1.OrderController.getAllOrders);
router.post('/create-payment-intent', order_controller_1.OrderController.createPaymentIntent);
router.get('/provider-orders', (0, auth_1.default)(user_constant_1.USER_ROLE.provider), order_controller_1.OrderController.getProviderOrders);
router.get('/my-orders', (0, auth_1.default)(user_constant_1.USER_ROLE.customer), order_controller_1.OrderController.getMyOrders);
router
    .route('/:orderId')
    .get((0, auth_1.default)(user_constant_1.USER_ROLE.customer, user_constant_1.USER_ROLE.provider), order_controller_1.OrderController.getOrderDetails)
    .patch((0, auth_1.default)(user_constant_1.USER_ROLE.provider), order_controller_1.OrderController.updateOrderStatusByProvider);
exports.default = router;
