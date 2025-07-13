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
  products?: any[]; // Optional products array
}
