export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  providerId: string;
}

export interface ProviderOrder {
  id: number;
  clientId: string;
  status: string;
  creationDateTime: Date;
  modificationDateTime?: Date;
  orderItems: OrderItem[];
  totalAmount: number;
}