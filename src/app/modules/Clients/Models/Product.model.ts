export interface Product {
  Id: number;
  Name: string;
  Description: string;
  Stock: number;
  BasePrice: number;
  Points: number;
  CategoryName: string;
  ShopName: string;
  CreatedAt: string;
  Images: string[]; // Make sure this is not optional
  ModificationDate: string;
  CategoryId: number;
  DisplayedPrice: number;
  DisplayedPriceAfterDiscount: number;
  EarnedPoints: number;
}
