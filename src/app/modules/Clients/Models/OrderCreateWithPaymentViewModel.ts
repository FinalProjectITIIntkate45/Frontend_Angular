import { OrderItemViewModel } from "./OrderItemViewModel";

export interface OrderCreateWithPaymentViewModel {
  clientId: string;
  paymentType: string; // يفضل تستخدم enum محلي في الفرونت لتحديد الأنواع (PayPal, COD, Points...)
  payPalOrderId?: string; // يستخدم لو كان الدفع PayPal
  couponCode?: string; // اختياري
  usedPaidPoints?: number; // عدد النقاط المدفوعة من الشوب
  usedFreePoints?: number; // عدد النقاط المجانية المستخدمة
  orderItems: OrderItemViewModel[]; // كل المنتجات اللي في الطلب
}
