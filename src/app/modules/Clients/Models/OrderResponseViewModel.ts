// path: shared/models/client/OrderResponseViewModel.ts
import { PaymentType } from './CheckoutResultVM';
import { OrderItemViewModel } from './OrderItemViewModel';
import { OrderStatus } from './order-status.enum';

export interface OrderResponseViewModel {
  id: number;
  clientId: string;
  dateCreated: string;
  totalPrice: number;
  status: OrderStatus;

  isPaid: boolean;
  paymentType: PaymentType;
  usedPaidPoints: number;
  usedFreePoints: number;
  earnedPoints: number;

  items: OrderItemViewModel[];
}
