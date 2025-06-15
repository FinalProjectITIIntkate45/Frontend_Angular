export interface ShopViewModel {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  street: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  businessPhone: string;
  businessEmail: string;
  logo: string;
  createdAt: Date;
  modificationDate: Date;
  status: number;
  isDeleted: boolean;
  providerId: string;
  typeId: number;
  typeName: string;
  shopImages: string[];
}
