import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { OrderService } from './order.service';
import sendResponse from '../../utils/sendResponse';
import { JwtPayload } from 'jsonwebtoken';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrder(
    req.body,
    req.user as JwtPayload,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order created succesfully',
    data: result,
  });
});

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const { price } = req.body;
  const result = await OrderService.createPaymentIntent(price);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Payment intent initialized succesfully',
    data: result,
  });
});

// const getOrderDetails = catchAsync(async (req: Request, res: Response) => {
//   const result = await OrderService.getOrderDetails(req.params.orderId);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Order retrive succesfully',
//     data: result,
//   });
// });

// const getMyOrders = catchAsync(async (req: Request, res: Response) => {
//   const result = await OrderService.getMyOrders(
//     req.query,
//     req.user as IJwtPayload,
//   );

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Order retrive succesfully',
//     data: result.result,
//     meta: result.meta,
//   });
// });

// const changeOrderStatus = catchAsync(async (req: Request, res: Response) => {
//   const { status } = req.body;
//   const result = await OrderService.changeOrderStatus(
//     req.params.orderId,
//     status,
//     req.user as IJwtPayload,
//   );

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Order status changed succesfully',
//     data: result,
//   });
// });

export const OrderController = {
  createOrder,
  createPaymentIntent,
  //   getMyShopOrders,
  //   getOrderDetails,
  //   getMyOrders,
  //   changeOrderStatus,
};
