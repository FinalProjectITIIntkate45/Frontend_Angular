
import { ProductInterface } from "./ProductInterface";

export interface CartItemInterface {
        id: number;
        quantity: number;
        supPrice: number;
        supPoints: number;
        productId: number;
        clientId: string;
        product: ProductInterface
}
