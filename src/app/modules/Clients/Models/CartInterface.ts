import { CartItemInterface } from './CartItemInterface';

export interface CartInterface {
  Items: Array<CartItemInterface>;
  price: number; // matches backend CartViewModel.price
  CartTotalPoints: number;
  price1?: number; // new backend field: main price (e.g. offers)
  price2?: number; // new backend field: secondary price (e.g. products)
}
