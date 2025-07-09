import { PaymentType } from '../../Clients/Models/CheckoutResultVM';
import {
  CustomerInfoViewModel,
  ShippingAddressViewModel,
} from '../../Clients/Models/OrderResponseViewModel';

export interface ProviderOrderItemViewModel {
  productId: number;
  productName: string;
  quantity: number;
  providerId?: string;
  price: number;
  name?: string;
  description?: string;
  shopName?: string;
  priceAfterDiscount?: number;
  image?: string;
  points?: number;
}

export interface ProviderOrderViewModel {
  id: number;
  clientId: string;
  status: string;
  creationDateTime: string;
  modificationDateTime?: string;
  totalAmount: number;
  isPaid: boolean;
  paymentType: any;
  usedPaidPoints: number;
  orderItems: ProviderOrderItemViewModel[];
  CustomerInfoS?: CustomerInfoViewModel;
  paymentMethodDisplay?: string;
  shippingAddress?: ShippingAddressViewModel;
}
