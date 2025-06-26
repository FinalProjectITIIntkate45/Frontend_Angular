import { BillingDataVM } from './BillingDataVM';
import { PaymentType } from './CheckoutResultVM';
import { OrderItemViewModel } from './OrderItemViewModel';


export interface OrderCreateViewModel {
  clientId: string;
  orderItems: OrderItemViewModel[];
  totalPrice: number;
  totalPoints: number;
  usedPaidPoints: number;
  usedFreePoints: number;
  couponCode: { code: string } | null
  paymentType: PaymentType; // enum
  billingData: BillingDataVM | null;
  status?: number;
}
