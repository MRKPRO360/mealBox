import { Router } from 'express';

import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post('/', auth(USER_ROLE.customer), OrderController.createOrder);

router.post('/create-payment-intent', OrderController.createPaymentIntent);

// Define routes
// router.get(
//     '/my-shop-orders',
//     auth(USER_ROLE.provider),
//     OrderController.getMyShopOrders
// );

// router.get(
//     '/my-orders',
//     auth(UserRole.USER),
//     OrderController.getMyOrders
// );

// router.get(
//     '/:orderId',
//     auth(UserRole.USER),
//     OrderController.getOrderDetails
// );

// router.patch(
//     '/:orderId/status',
//     auth(UserRole.USER),
//     OrderController.changeOrderStatus
// )

export default router;
