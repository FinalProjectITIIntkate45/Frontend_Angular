export interface ShopEditViewModel {
  id: number;
  shopName: string;
  description: string;
  address: string;
  contactDetails: string;
  logo?: File;
  providerId?: string;
}
