export const ORDER_STATUS = {
  PENDING: 'pending',
  INPROGRESS: 'inProgress',
  DELIVERED: 'delivered',
  CANCELED: 'canceled',
} as const;

export type TOrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
