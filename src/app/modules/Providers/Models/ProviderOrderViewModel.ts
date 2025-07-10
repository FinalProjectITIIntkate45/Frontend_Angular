import { PaymentType } from '../../Clients/Models/CheckoutResultVM';
import {
  CustomerInfoViewModel,
  ShippingAddressViewModel,
} from '../../Clients/Models/OrderResponseViewModel';

export interface ProviderOrderItemViewModel {
  ProductId: number;
  ProductName: string;
  Quantity: number;
  ProviderId?: string;
  Price: number;
  Name?: string;
  Description?: string;
  ShopName?: string;
  PriceAfterDiscount?: number;
  Image?: string;
  Points?: number;
}

export interface ProviderOrderViewModel {
  Id: number;
  ClientId: string;
  Status: string;
  CreationDateTime: string;
  ModificationDateTime?: string;
  TotalAmount: number;
  IsPaid: boolean;
  PaymentType: PaymentType;
  UsedPaidPoints: number;
  OrderItems: ProviderOrderItemViewModel[];
  CustomerInfo?: CustomerInfoViewModel;
  PaymentMethodDisplay?: string;
  ShippingAddress?: ShippingAddressViewModel;
}
