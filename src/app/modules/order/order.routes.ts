import { Router } from 'express';

import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router
  .route('/')
  .post(auth(USER_ROLE.customer), OrderController.createOrder)
  .get(
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    OrderController.getAllOrders,
  );

router.post('/create-payment-intent', OrderController.createPaymentIntent);

router.get(
  '/provider-orders',
  auth(USER_ROLE.provider),
  OrderController.getProviderOrders,
);
router.get('/my-orders', auth(USER_ROLE.customer), OrderController.getMyOrders);

router
  .route('/:orderId')
  .get(
    auth(USER_ROLE.customer, USER_ROLE.provider),
    OrderController.getOrderDetails,
  )
  .patch(auth(USER_ROLE.provider), OrderController.updateOrderStatusByProvider);

export default router;
