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
  couponCode?: string;
  paymentType: PaymentType; // enum
  billingData: BillingDataVM;
  status?: number;
}

// export interface OrderCreateViewModel {
//   clientId: string;
//   orderItems: OrderItemViewModel[];
//   totalPrice: number;
//   totalPoints: number;
//   usedPaidPoints: number;
//   usedFreePoints: number;
//   couponCode?: string;
//   paymentType: PaymentType; // enum
//   billingData: BillingDataVM;  // هنا إضافة BillingData
//   status?: number;
// }
