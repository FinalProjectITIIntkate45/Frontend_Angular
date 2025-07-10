// path: shared/models/provider/ProviderOrderItemViewModel.ts
export interface ProviderOrderItemViewModel {
  productId: number;
  productName?: string;
  quantity: number;
  providerId?: string;

  price?: number;
  name?: string;
  description?: string;
  shopName?: string;
  priceAfterDiscount?: number;
  image?: string;
  points?: number;
}
