export interface ConfirmPaymentVM {
  transactionId: string;
  orderId: number;
  paymentProvider: string; // مثلاً: "paymob" أو "paypal" أو "stripe"
  isPaymentValid?: boolean;
}
