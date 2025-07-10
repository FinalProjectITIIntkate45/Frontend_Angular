import { CustomerInfoViewModel } from '../../Clients/Models/OrderResponseViewModel';

export interface OrderItem {
  ProductId: number;
  ProductName: string;
  Quantity: number;
  Price: number;
  ProviderId: string;
}

export interface ProviderOrder {
  Id: number;
  ClientId: string;
  Status: string;
  CreationDateTime: Date;
  ModificationDateTime?: Date;
  OrderItems: OrderItem[];
  TotalAmount: number;
  CustomerInfo?: CustomerInfoViewModel;
}

export enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Shipped = 2,
  Delivered = 3,
  Canceled = 4,
}
