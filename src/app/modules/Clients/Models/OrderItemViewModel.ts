export interface OrderItemViewModel {
  ProductId: number;
  ProductName: string; // <-- ضروري
  Quantity: number;
  Price?: number;
  ShopName?: string;
  Description?: string;
  PriceAfterDiscount?: number;
  Image?: string;
  Points?: number;
}
