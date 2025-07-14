export interface ReviewView {
  id: number;
  comments: string;
  rating: number;
  modificationDateTime: string;
  clientName?: string;
  orderId: number;
}
