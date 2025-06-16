export class CouponCode {
  id: number;
  code: string;
  discount: number;
  expiryDate: Date;
  type: CouponType;
  status: CouponStatus;
  productId?: number;
  shopId?: number;
  maxUsage: number;
  currentUsage: number;
  providerId: string;
  isDeleted: boolean;

  constructor() {
    this.id = 0;
    this.code = '';
    this.discount = 0;
    this.expiryDate = new Date();
    this.type = CouponType.Global;
    this.status = CouponStatus.Active;
    this.maxUsage = 1;
    this.currentUsage = 0;
    this.providerId = '';
    this.isDeleted = false;
  }
}

export enum CouponType {
  Global = 0, // لكل المنتجات
  Shop = 1, // متجر محدد
  Product = 2 // منتج محدد
}

export enum CouponStatus {
  Active = 0, // نشط
  Inactive = 1, // غير نشط
  Expired = 2 // منتهي الصلاحية
}
