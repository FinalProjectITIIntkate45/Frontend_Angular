import { ProductAttribute } from "./product-attribute.model";
export interface Product {
  Id: number;
  Name: string;
  Description: string;
  Stock: number;
  BasePrice: number;
  Points: number;
  CategoryId: number;
  CategoryName?: string;
  ShopName?: string;
  CreatedAt: string;
  ModificationDate: string;
  DisplayedPrice: number;
  DisplayedPriceAfterDiscount?: number;
  IsSpecialOffer: boolean;
  EarnedPoints: number;
  Images: string[];
  Attributes?: ProductAttribute[];
}

