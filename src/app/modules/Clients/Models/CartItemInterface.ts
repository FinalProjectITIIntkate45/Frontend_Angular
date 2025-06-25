import { ProductInterface12 } from "./ProductInterface12";
import { OfferViewModel } from "./OfferViewModel";

export interface CartItemInterface {
  cartItemId?: number;
  productVM?: ProductInterface12;
  offer?: OfferViewModel;
}
