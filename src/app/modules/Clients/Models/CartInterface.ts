import { CartItemInterface } from "./CartItemInterface";

export interface CartInterface {
    Items: Array<CartItemInterface>;
    CartTotalPrice: number; // legacy, use price1/price2 if present
    CartTotalPoints : number;
    price1?: number; // new backend field: main price (e.g. offers)
    price2?: number; // new backend field: secondary price (e.g. products)
}