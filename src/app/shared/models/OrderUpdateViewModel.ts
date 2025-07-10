import { OrderStatus } from "./OrderStatus";

export interface OrderUpdateViewModel {
  status: OrderStatus; // أو number لو الـ enum معرف كأرقام
}
