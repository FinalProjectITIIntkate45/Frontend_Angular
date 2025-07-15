export interface CheckoutResultVM {
  Success: boolean;
  Message: string;
  FinalAmount: number;
  UsedPaidPoints: number;
  UsedFreePoints: number;
  EarnedPoints: number;
  PaymentUrl?: string;
  OrderId?: number;
}
export enum PaymentType {
  CashCollection = 123456,
  AcceptKiosk = 654321,
  MobileWallet = 789012,
  PayPal = 5044433,
  OnlineCard = 5044395,
  Paymob = 913666,
  CashOnDelivery = 504450,
  PointsOnly = 0,
  Stripe = 873645,
  Wallet = 304235,
}
