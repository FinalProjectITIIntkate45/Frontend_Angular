

import { PaymentType } from '../../Clients/Models/CheckoutResultVM';

import { ProviderOrderItemViewModel } from './ProviderOrderItemViewModel';

export interface ProviderOrderViewModel {
  id: number;
  clientId: string;
  status: string;
  creationDateTime: string;
  modificationDateTime?: string;

  orderItems: ProviderOrderItemViewModel[];
  totalAmount: number;

  isPaid: boolean;
  paymentType: PaymentType;
  usedPaidPoints: number;
}
