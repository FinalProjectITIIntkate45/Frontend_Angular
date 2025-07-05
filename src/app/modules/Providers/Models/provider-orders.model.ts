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
}
