export interface OrderItemViewModel {
  productId: number;
  quantity: number;
  price?: number;

  // ✅ خصائص إضافية لعرض المنتجات في الواجهة
  name?: string;
  shopName?: string;
  description?: string;
  priceAfterDiscount?: number;
  image?: string;
  points?: number;
}
