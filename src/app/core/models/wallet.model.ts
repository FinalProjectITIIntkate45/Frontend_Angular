export interface Wallet {
  id: number;
  balancePoints: number;
  balancecash: number;
  lastUpdated: string;
  usertId: string;

  // Calculated properties for points breakdown
  totalShopPoints: number;
  totalFreePoints: number;
  totalPendingPoints: number;
  totalAllPoints: number;
}
