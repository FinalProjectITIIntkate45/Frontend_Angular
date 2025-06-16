import { CartItemInterface } from "./CartItemInterface";

export interface CartInterface {
    Items: Array<CartItemInterface>;
    CartTotalPrice: number;
    CartTotalPoints : number;
}