import { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';
import Recipe from '../recipe/recipe.model';
import AppError from '../../errors/AppError';

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    meals: [
      {
        meal: {
          type: Schema.Types.ObjectId,
          ref: 'Recipe',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        selectedSize: {
          type: String,
          enum: ['small', 'medium', 'large'],
          required: true,
        },
        status: {
          type: String,
          enum: ['Pending', 'Completed', 'Cancelled'],
          default: 'Pending',
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Online', 'Card'],
      default: 'Online',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Canecelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook to calculate total, discount, delivery charge, and final price
orderSchema.pre('validate', async function (next) {
  // Step 1: Initialize total amount
  let totalAmount = 0;

  // Step 2: Calculate total amount for products

  for (const mealItem of this.meals) {
    const meal = await Recipe.findById(mealItem.meal);

    if (!meal) {
      throw new AppError(404, `Meal with ID ${mealItem.meal} not found`);
    }

    // Get the price from the selected portion size
    const selectedPortion = meal.portionSizes[mealItem.selectedSize];

    if (!selectedPortion) {
      throw new Error(
        `Selected portion size not found for meal ${mealItem.meal}`,
      );
    }

    totalAmount += Number(selectedPortion.price) * mealItem.quantity;
  }

  const isDhaka = this?.shippingAddress?.toLowerCase()?.includes('dhaka');
  const deliveryCharge = isDhaka ? 5 : 10;

  this.totalAmount = totalAmount;

  this.deliveryCharge = deliveryCharge;
  this.finalAmount = totalAmount + deliveryCharge;
  next();
});

export const Order = model<IOrder>('Order', orderSchema);
