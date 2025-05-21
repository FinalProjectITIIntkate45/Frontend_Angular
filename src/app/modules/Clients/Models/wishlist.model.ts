export interface WishlistItem {
  productId: number;
  productName: string;
  clientId: string;
  price?: number; // إضافة السعر
  discount?: boolean; // إضافة الخصم
}

export interface WishlistVM {
  ProductId: number;
}
