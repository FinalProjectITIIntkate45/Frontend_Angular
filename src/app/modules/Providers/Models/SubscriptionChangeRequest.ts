export interface SubscriptionChangeRequest {
  type: 'Free' | 'VIP';
  paymentMethod?: 'OnlineCard' | 'VodafoneCash' | 'MeezaQR';
  transactionId?: string;
  isPaid: boolean;
}

