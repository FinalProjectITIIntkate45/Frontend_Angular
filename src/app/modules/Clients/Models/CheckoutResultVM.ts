export interface CheckoutResultVM {
  success: boolean;
  message: string;
  finalAmount: number;
  usedPaidPoints: number;
  usedFreePoints: number;
  earnedPoints: number;
  paymentUrl?: string;
  orderId?: number;
}
export enum PaymentType {
  PointsOnly = 0,
  CashCollection = 123456,
  AcceptKiosk = 654321,
  MobileWallet = 789012,
  PayPal = 5044433,
  OnlineCard = 5044395,
  Paymob = 913666,
  CashOnDelivery = 504450
}
