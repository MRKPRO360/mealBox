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

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrdersFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders retrived succesfully',
    data: result,
  });
});

const getOrderDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getOrderDetailsFromDB(req.params.orderId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order retrive succesfully',
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getMyOrdersFromDB(
    req.query,
    req.user as JwtPayload,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order retrive succesfully',
    data: result.result,
    meta: result.meta,
  });
});

const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getProviderOrdersFromDB(
    req.user as JwtPayload,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order retrive succesfully',
    data: result,
  });
});

const updateOrderStatusByProvider = catchAsync(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const result = await OrderService.updateOrderStatusByProviderFromDB(
      orderId,
      req.user as JwtPayload,
      status,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Order status updated succesfully',
      data: result,
    });
  },
);

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
  createPaymentIntent,
  createOrder,
  getAllOrders,
  getOrderDetails,
  getMyOrders,
  getProviderOrders,
  updateOrderStatusByProvider,
};
