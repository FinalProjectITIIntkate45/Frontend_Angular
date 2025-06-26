export interface WishlistItem {
  ProductId: number;
  ProductName: string;
  ProductImage: string;
  ProductPrice: number;
  ProductPoints: number;
  DiscountPercentage?: number;
}

export interface WishlistVM {
  ProductId: number;
}