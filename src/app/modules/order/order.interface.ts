import { Types, Document } from 'mongoose';
import { IPayment } from '../payment/payment.interface';

export interface IOrderMeal {
  meal: Types.ObjectId;
  quantity: number;
  selectedSize: 'small' | 'medium' | 'large';
  status: 'Pending' | 'Completed' | 'Cancelled';
}
export interface IOrder extends Document {
  user: Types.ObjectId;
  shippingAddress: string;
  meals: IOrderMeal[];
  totalAmount: number;
  //   discount: number;
  deliveryCharge: number;
  finalAmount: number;
  paymentMethod: 'Cash' | 'Card' | 'Online';
  orderStatus: 'Pending' | 'Completed' | 'Cancelled';
  paymentIntentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  payment?: IPayment | null;
}
