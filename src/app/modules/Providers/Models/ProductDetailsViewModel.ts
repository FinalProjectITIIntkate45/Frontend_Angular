export interface ProductDetailsViewModel {
  id: number;
  name: string;
  description: string;

  stock: number;
  basePrice: number;
  points: number;

  categoryName: string;
  shopName: string;

  createdAt: string; 
  images: string[];

  modificationDate: string;
  categoryId: number;

  displayedPrice: number;
  displayedPriceAfterDiscount?: number; 
  isSpecialOffer: boolean;
  earnedPoints: number;
}
