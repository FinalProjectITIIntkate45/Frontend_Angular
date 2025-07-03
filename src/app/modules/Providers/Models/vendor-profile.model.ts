export interface ShippingOption {
  orderId: number;
  address: string;
  status: string;
}

export interface VendorProfile {
  userId: string;
  userName: string;
  email: string;
  phoneNumber: string;
  profileImg: string;
  nationalID: string;

  shopId: number;
  shopName: string;
  shopDescription: string;
  shopAddress: string;
  city: string;
  street: string;
  postalCode: string;
  businessPhone: string;
  businessEmail: string;
  shopLogo: string;
  latitude: number;
  longitude: number;

  balancePoints: number;
  totalShopPoints: number;
  totalFreePoints: number;
  totalPendingPoints: number;

  hasActiveSubscription: boolean;
  subscriptionExpireDate: Date | null;
  subscriptionType: string;

  totalRevenue: number;
  orderCount: number;
  averageCustomerRating: number;

  shippingOptions: ShippingOption[];
}
