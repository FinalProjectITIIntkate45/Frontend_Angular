import { ProductInterface } from './ProductInterface';

export interface CartItemInterface {
  ProductId: number;
  ProductName: string;
  shopName: string;

  Price: number;
  points: number;
  Quantity: number;
  TotalPrice: number;
  Totalpoints: number;
  ImgUrl: string;
}
