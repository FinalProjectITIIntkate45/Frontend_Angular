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
export interface ShopViewModel {
  Id: number;
  Name: string;
  Description: string;
  Address: string;
  City: string;
  Street: string;
  PostalCode: string;
  Latitude: number;
  Longitude: number;
  BusinessPhone: string;
  BusinessEmail: string;
  Logo: string;
  CreatedAt: Date;
  ModificationDate: Date;
  Status: number;
  IsDeleted: boolean;
  ProviderId: string;
  TypeId: number;
  TypeName: string;
  ShopImages: string[];
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
