
import { OrderItemResponseViewModel } from './order-item-response';
import { OrderStatus } from './order-status.enum';

export interface OrderResponseViewModel {
  id: number;
  clientId: string;
  dateCreated: string; // لو جاية كـ string ISO Date من الباك
  totalPrice: number;
  status: OrderStatus;
  items: OrderItemResponseViewModel[];
}
