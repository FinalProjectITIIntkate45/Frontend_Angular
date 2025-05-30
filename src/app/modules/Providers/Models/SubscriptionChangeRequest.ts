export interface SubscriptionChangeRequest {
  type: 'Free' | 'VIP';
  PaymentType?: 'OnlineCard' | 'VodafoneCash' | 'MeezaQR';
  transactionId?: string;
  isPaid: boolean;
}

