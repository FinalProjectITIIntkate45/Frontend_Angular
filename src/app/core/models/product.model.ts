import { ProductAttribute } from "./product-attribute.model";

export interface Product {
  id: number;
  name: string;
  description: string;
  stock: number;
  basePrice: number;
  points: number;
  categoryId: number;
  categoryName?: string;
  shopName?: string;
  createdAt: string;
  modificationDate: string;
  displayedPrice: number;
  displayedPriceAfterDiscount?: number;
  isSpecialOffer: boolean;
  earnedPoints: number;
  images: string[];
  attributes?: ProductAttribute[];
}
