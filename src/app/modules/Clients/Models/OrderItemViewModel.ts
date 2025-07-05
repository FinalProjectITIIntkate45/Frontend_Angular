export interface OrderItemViewModel {
  productId: number;
  quantity: number;
  price?: number;
  name?: string;
  shopName?: string;
  description?: string;
  priceAfterDiscount?: number;
  image?: string;
  points?: number;
}
