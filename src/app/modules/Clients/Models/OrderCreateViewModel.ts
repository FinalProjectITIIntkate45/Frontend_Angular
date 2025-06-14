import { BillingDataVM } from './BillingDataVM';
import { OrderItemViewModel } from './OrderItemViewModel';


export interface OrderCreateViewModel {
  clientId: string;
  orderItems: OrderItemViewModel[];
  totalPrice: number;
  totalPoints: number;
  usedPaidPoints: number;
  usedFreePoints: number;
  couponCode?: string;
  paymentType: number; // enum
  billingData: BillingDataVM;
  status?: number;
}
