/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export interface IPayment {
  user: Types.ObjectId;
  order: Types.ObjectId;
  method: 'COD' | 'Online' | 'Card';
  status: 'Pending' | 'Paid' | 'Failed';
  paymentIntentId?: string;
  amount: number;
  gatewayResponse?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
