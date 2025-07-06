// shared/models/client/OrderResponseViewModel.ts
import { PaymentType } from './CheckoutResultVM';
import { OrderItemViewModel } from './OrderItemViewModel';
import { OrderStatus } from './order-status.enum';

export interface OrderResponseViewModel {
  Id: number;
  ClientId: string;
  DateCreated: string;
  TotalPrice: number;
  Status: OrderStatus;

  IsPaid: boolean;
  PaymentType: PaymentType;
  UsedPaidPoints: number;
  UsedFreePoints: number;
  EarnedPoints: number;

  Items: OrderItemViewModel[];
}
