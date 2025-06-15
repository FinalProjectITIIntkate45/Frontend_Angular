export interface ShopEditViewModel {
  id: number;
  shopName: string;
  description: string;
  address: string;
  city: string;
  street: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  businessPhone: string;
  businessEmail: string;
  logo?: string | File;
  shopTypeId: number;
  providerId: string;
  contactDetails?: string;
}
export interface ShopCreateModel {
  shopName: string;
  description: string;
  address: string;
  city: string;
  street: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  businessPhone: string;
  businessEmail: string;
  logo?: File;
  images?: File[];
  providerId?: string;
  shopTypeId: number;
}
