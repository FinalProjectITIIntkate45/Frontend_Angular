export interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  displayedPrice: number;
  displayedPriceAfterDiscount?: number;
  stock: number;
  isSpecialOffer: boolean;
  earnedPoints: number;
  rating?: number;
  shopId: number;
  shopName: string;
  categoryId: number;
  categoryName: string;
  images: string[];
}
