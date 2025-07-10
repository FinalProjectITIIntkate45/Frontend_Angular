import { OfferViewModel } from './OfferViewModel';
import { ProductInterface } from './ProductInterface';

export interface CartItemInterface {
  cartItemId?: number;
  qty?: number;
  productVM?: ProductInterface;
  offer?: OfferViewModel;
}
