import { ProductInterface } from "./ProductInterface";
import { OfferViewModel } from "./OfferViewModel";

export interface CartItemInterface {
  cartItemId?: number;
  productVM?: ProductInterface;
  offer?: OfferViewModel;
}
