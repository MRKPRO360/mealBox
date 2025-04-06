import { Types } from 'mongoose';
import { Order } from './order.model';

export const hasCustomerPurchasedRecipe = async (
  userId: Types.ObjectId,
  recipeId: Types.ObjectId,
): Promise<boolean> => {
  const order = await Order.findOne({
    user: userId,
    meals: {
      $elemMatch: {
        meal: recipeId,
        status: 'Completed',
      },
    },
  });

  return !!order;
};
