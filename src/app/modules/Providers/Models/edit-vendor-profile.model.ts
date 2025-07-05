export interface EditVendorProfile {
  userName: string;
  email: string;
  phoneNumber: string;
  profileImg?: string;
  nationalID?: string;

  // Shop Info
  shopName: string;
  shopDescription?: string;
  shopAddress?: string;
  city?: string;
  street?: string;
  postalCode?: string;
  businessPhone?: string;
  businessEmail?: string;
  shopLogo?: string;
  latitude?: number;
  longitude?: number;

  // Shipping Options
  shippingOptions: ShippingOption[];
}

export interface ShippingOption {
  orderId: number;
  address: string;
  status: string;
}
