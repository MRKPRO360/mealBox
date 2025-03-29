import mongoose from 'mongoose';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { Payment } from '../payment/payment.model';
import { generateOrderInvoicePDF } from '../../utils/generateOrderInvoicePDF';
import Recipe from '../recipe/recipe.model';
import { JwtPayload } from 'jsonwebtoken';
import { EmailHelper } from '../../utils/EmailHelpert';

import Stripe from 'stripe';
import config from '../../config';
import AppError from '../../errors/AppError';

const stripe = new Stripe(config.stripe_sk_test as string);

const createOrder = async (
  orderData: Partial<IOrder>,
  authUser: JwtPayload,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (orderData.meals) {
      for (const recipeItem of orderData.meals) {
        const recipe = await Recipe.findById(recipeItem.meal);

        if (recipe) {
          if (recipe.isDeleted === true) {
            throw new AppError(400, `reicpe ${recipe?.recipeName} is deleted!`);
          }

          if (Number(recipe.quantity) < recipeItem.quantity) {
            throw new AppError(
              400,
              `Insufficient quantity for recipe: ${recipe.recipeName}`,
            );
          }
          // Decrement the recipe stock
          recipe.quantity = String(
            Number(recipe.quantity) - recipeItem.quantity,
          );

          await recipe.save({ session });
        } else {
          throw new AppError(404, `recipe not found: ${recipeItem.meal}`);
        }
      }
    }

    // Create the order
    const order = new Order({
      ...orderData,
      user: authUser.id,
    });

    const createdOrder = await order.save({ session });
    await createdOrder.populate('user meals.meal');

    let result;

    if (createdOrder.paymentMethod == 'Card') {
      const payment = new Payment({
        user: authUser.id,
        order: createdOrder._id,
        method: orderData.paymentMethod,
        paymentIntentId: orderData.paymentIntentId,
        amount: createdOrder.finalAmount,
        status: 'Paid',
      });

      result = await payment.save({ session });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    /*
    const pdfBuffer = await generateOrderInvoicePDF(createdOrder);
    const emailContent = await EmailHelper.createEmailContent(
      { userName: createdOrder.user.firstName || '' },
      'orderInvoice',
    );

    const attachment = {
      filename: `Invoice_${createdOrder._id}.pdf`,
      content: pdfBuffer,
      encoding: 'base64', // if necessary
    };

    await EmailHelper.sendEmail(
      createdOrder.user.email,
      emailContent,
      'Order confirmed!',
      attachment,
    );

    */

    return result;
  } catch (error) {
    console.log(error);
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// stripe payment-intent
const createPaymentIntent = async (price: string) => {
  if (!price) return;
  const amount = Number(price) * 100;

  const paymentIntent = await stripe.paymentIntents.create({
    currency: 'usd',
    amount: amount,
    payment_method_types: ['card'],
  });

  return paymentIntent.client_secret;
};

// app.post("/payments", async (req, res) => {
//   const payment = req.body;
//   const result = await paymentsCollection.insertOne(payment);

//   const id = payment.propertyId;
//   const filter = { _id: new ObjectId(id) };

//   const updatedDoc = {
//     $set: {
//       paid: true,
//       transactionId: payment.transactionId,
//     },
//   };

//   await propertyCollection.updateOne(filter, updatedDoc);

//   res.send(result);
// });

// const getMyRecipeOrders = async (
//   query: Record<string, unknown>,
//   authUser: JwtPayload,
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

//   const orderQuery = new QueryBuilder(
//     Order.find({ shop: shopIsActive._id }).populate(
//       'user products.product coupon',
//     ),
//     query,
//   )
//     .search(['user.name', 'user.email', 'products.product.name'])
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await orderQuery.modelQuery;

//   const meta = await orderQuery.countTotal();

//   return {
//     meta,
//     result,
//   };
// };

// const getOrderDetails = async (orderId: string) => {
//   const order = await Order.findById(orderId).populate(
//     'user products.product coupon',
//   );
//   if (!order) {
//     throw new AppError(404, 'Order not Found');
//   }

//   order.payment = await Payment.findOne({ order: order._id });
//   return order;
// };

// const getMyOrders = async (
//   query: Record<string, unknown>,
//   authUser: JwtPayload,
// ) => {
//   const orderQuery = new QueryBuilder(
//     Order.find({ user: authUser.userId }).populate(
//       'user products.product coupon',
//     ),
//     query,
//   )
//     .search(['user.name', 'user.email', 'products.product.name'])
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await orderQuery.modelQuery;

//   const meta = await orderQuery.countTotal();

//   return {
//     meta,
//     result,
//   };
// };

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

export const OrderService = {
  createOrder,
  createPaymentIntent,
  //   getMyShopOrders,
  //   getOrderDetails,
  //   getMyOrders,
  //   changeOrderStatus,
};
