export interface ShopEditViewModel {
  id: number; // Unique ID of the shop
  shopName: string; // Display name of the shop
  description: string; // Brief description or bio
  address: string; // Physical location
  contactDetails: string; // Phone, email, etc.
  logo?: File; // Optional logo file for upload
  providerId?: string; // Optional provider reference
}