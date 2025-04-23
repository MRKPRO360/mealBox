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
exports.OrderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = require("./order.model");
const payment_model_1 = require("../payment/payment.model");
// import { generateOrderInvoicePDF } from '../../utils/generateOrderInvoicePDF';
// import { EmailHelper } from '../../utils/EmailHelpert';
const recipe_model_1 = __importDefault(require("../recipe/recipe.model"));
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const provider_model_1 = __importDefault(require("../provider/provider.model"));
const stripe = new stripe_1.default(config_1.default.stripe_sk_test);
const createOrder = (orderData, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        if (orderData.meals) {
            for (const recipeItem of orderData.meals) {
                const recipe = yield recipe_model_1.default.findById(recipeItem.meal);
                if (recipe) {
                    if (recipe.isDeleted === true) {
                        throw new AppError_1.default(400, `reicpe ${recipe === null || recipe === void 0 ? void 0 : recipe.recipeName} is deleted!`);
                    }
                    if (Number(recipe.quantity) < recipeItem.quantity) {
                        throw new AppError_1.default(400, `Insufficient quantity for recipe: ${recipe.recipeName}`);
                    }
                    // Decrement the recipe stock
                    recipe.quantity = String(Number(recipe.quantity) - recipeItem.quantity);
                    yield recipe.save({ session });
                }
                else {
                    throw new AppError_1.default(404, `recipe not found: ${recipeItem.meal}`);
                }
            }
        }
        // Create the order
        const order = new order_model_1.Order(Object.assign(Object.assign({}, orderData), { user: authUser.id }));
        const createdOrder = yield order.save({ session });
        yield createdOrder.populate('user meals.meal');
        let result;
        if (createdOrder.paymentMethod == 'Card') {
            const payment = new payment_model_1.Payment({
                user: authUser.id,
                order: createdOrder._id,
                method: orderData.paymentMethod,
                paymentIntentId: orderData.paymentIntentId,
                amount: createdOrder.finalAmount,
                status: 'Paid',
            });
            result = yield payment.save({ session });
        }
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        // const pdfBuffer = await generateOrderInvoicePDF(createdOrder);
        // const emailContent = await EmailHelper.createEmailContent(
        //   {
        //     userName: (createdOrder.user as unknown as IUser).name.firstName || '',
        //   },
        //   'orderInvoice',
        // );
        // const attachment = {
        //   filename: `Invoice_${createdOrder._id}.pdf`,
        //   content: pdfBuffer,
        //   encoding: 'base64', // if necessary
        // };
        // if (emailContent) {
        //   await EmailHelper.sendEmail(
        //     (createdOrder.user as unknown as IUser).email,
        //     emailContent,
        //     'Order confirmed!',
        //     attachment,
        //   );
        // }
        return result;
    }
    catch (error) {
        console.log(error);
        // Rollback the transaction in case of error
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// stripe payment-intent
const createPaymentIntent = (price) => __awaiter(void 0, void 0, void 0, function* () {
    if (!price)
        return;
    const amount = Number(price) * 100;
    const paymentIntent = yield stripe.paymentIntents.create({
        currency: 'usd',
        amount: amount,
        payment_method_types: ['card'],
    });
    return paymentIntent.client_secret;
});
const getAllOrdersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield order_model_1.Order.find({});
});
const getProviderOrdersFromDB = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find({}).populate({
        path: 'meals.meal',
        // select: 'providerId recipeName recipoe',
    });
    const provider = yield provider_model_1.default.findOne({
        user: authUser.id,
    }).select('_id');
    if (!provider)
        throw new AppError_1.default(400, 'No provider found!');
    const filteredOrders = orders
        .map((order) => {
        const mealsForProvider = order.meals.filter((meal) => {
            return (meal.meal.providerId.toString() ===
                provider._id.toString());
        });
        return mealsForProvider.length > 0
            ? Object.assign(Object.assign({}, order.toObject()), { meals: mealsForProvider }) : null;
    })
        .filter((order) => order !== null); // Remove orders with no meals from this provider
    return filteredOrders;
});
const getOrderDetailsFromDB = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId).populate('user meals.meal');
    if (!order) {
        throw new AppError_1.default(404, 'Order not Found');
    }
    order.payment = yield payment_model_1.Payment.findOne({ order: order._id });
    return order;
});
const getMyOrdersFromDB = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.default(order_model_1.Order.find({ user: authUser.id }).populate('user meals.meal'), query)
        .search(['user.name', 'user.email', 'meals.meal.recipeName'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield orderQuery.modelQuery;
    const meta = yield orderQuery.countTotal();
    return {
        meta,
        result,
    };
});
// const changeOrderStatus = async (
//   orderId: string,
//   status: string,
//   authUser: IJwtPayload,
// ) => {
//   const userHasShop = await User.findById(authUser.userId).select(
//     'isActive hasShop',
//   );
//   if (!userHasShop)
//     throw new AppError(404, 'User not found!');
//   if (!userHasShop.isActive)
//     throw new AppError(400, 'User account is not active!');
//   if (!userHasShop.hasShop)
//     throw new AppError(400, 'User does not have any shop!');
//   const shopIsActive = await Shop.findOne({
//     user: userHasShop._id,
//     isActive: true,
//   }).select('isActive');
//   if (!shopIsActive)
//     throw new AppError(400, 'Shop is not active!');
//   const order = await Order.findOneAndUpdate(
//     { _id: new Types.ObjectId(orderId), shop: shopIsActive._id },
//     { status },
//     { new: true },
//   );
//   return order;
// };
const updateOrderStatusByProviderFromDB = (orderId, authUser, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = yield provider_model_1.default.findOne({
        user: authUser.id,
    }).select('_id');
    if (!provider)
        throw new AppError_1.default(400, 'No provider found!');
    const order = yield order_model_1.Order.findById(orderId).populate('meals.meal');
    if (!order) {
        throw new AppError_1.default(400, 'Order not found');
    }
    // Update only the meals from the specified provider
    order.meals.forEach((meal) => {
        if (meal.meal.providerId.toString() ===
            provider._id.toString()) {
            meal.status = newStatus;
        }
    });
    const allStatuses = order.meals.map((meal) => meal.status);
    if (allStatuses.every((status) => status === 'Completed')) {
        order.orderStatus = 'Completed';
    }
    else if (allStatuses.every((status) => status === 'Cancelled')) {
        order.orderStatus = 'Cancelled';
    }
    else {
        order.orderStatus = 'Pending';
    }
    return yield order.save();
});
exports.OrderService = {
    createOrder,
    createPaymentIntent,
    getMyOrdersFromDB,
    getProviderOrdersFromDB,
    getOrderDetailsFromDB,
    getAllOrdersFromDB,
    updateOrderStatusByProviderFromDB,
    //   getMyShopOrders,
    //   changeOrderStatus,
};
