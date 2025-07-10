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

export interface PendingPoint {
  id: number;
  points: number;
  createdAt: string;
  activationDate: string;
  orderId: number;
  shop: ShopInfo;
  status: string;
}

export interface PointSummary {
  totalPoints: number;
  totalCount: number;
  recentPoints: (ShopPoint | FreePoint | PendingPoint)[];
}

export interface WalletSummary {
  balancePoints: number;
  balanceCash: number;
  lastUpdated: string;
  freePoints: PointSummary;
  shopPoints: PointSummary;
  pendingPoints: PointSummary;
}

export interface PaginationInfo {
  pageNumber: number;
  pageSize: number;
  totalShopPoints: number;
  totalFreePoints: number;
  totalPages: number;
}

export interface WalletView {
  ShopPoints: ShopPoint[];
  FreePoints: FreePoint[];
}

export interface WalletDetailsResponse {
  wallet: any; // Basic wallet info
  ShopPoints: ShopPoint[];
  FreePoints: FreePoint[];
  pagination: PaginationInfo;
}

// Basic wallet info for quick loading
export interface BasicWallet {
  id: number;
  BalancePoints: number;
  BalanceCash: number;
  LastUpdated: string;
  UserId?: string;
}
