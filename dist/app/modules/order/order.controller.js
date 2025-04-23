"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const order_service_1 = require("./order.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderService.createOrder(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Order created succesfully',
        data: result,
    });
}));
const createPaymentIntent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { price } = req.body;
    const result = yield order_service_1.OrderService.createPaymentIntent(price);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Payment intent initialized succesfully',
        data: result,
    });
}));
const getAllOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderService.getAllOrdersFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Orders retrived succesfully',
        data: result,
    });
}));
const getOrderDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderService.getOrderDetailsFromDB(req.params.orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Order retrive succesfully',
        data: result,
    });
}));
const getMyOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderService.getMyOrdersFromDB(req.query, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Order retrive succesfully',
        data: result,
    });
}));
const getProviderOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderService.getProviderOrdersFromDB(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Order retrive succesfully',
        data: result,
    });
}));
const updateOrderStatusByProvider = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { status } = req.body;
    const result = yield order_service_1.OrderService.updateOrderStatusByProviderFromDB(orderId, req.user, status);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Order status updated succesfully',
        data: result,
    });
}));
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
exports.OrderController = {
    createPaymentIntent,
    createOrder,
    getAllOrders,
    getOrderDetails,
    getMyOrders,
    getProviderOrders,
    updateOrderStatusByProvider,
};
