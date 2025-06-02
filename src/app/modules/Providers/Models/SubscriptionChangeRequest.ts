export interface SubscriptionChangeRequest {
  Type: number;
PaymentType?: number;
  transactionId?: string;
  IsPaid: boolean;
}

