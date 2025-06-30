export interface ShopInfo {
  id: number;
  name: string;
  logo?: string;
  typeId: number;
  shopType?: string;
}

export interface ShopPoint {
  id: number;
  points: number;
  earnedAt: string;
  expireAt: string;
  shop: ShopInfo;
}

export interface FreePoint {
  id: number;
  points: number;
  earnedAt: string;
  expireAt: string;
  sourceType: string;
  reference?: string;
}

export interface WalletView {
  shopPoints: ShopPoint[];
  freePoints: FreePoint[];
}
