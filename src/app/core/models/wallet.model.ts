export interface Wallet {
  id: number;
  balancePoints: number;
  balancecash: number;
  lastUpdated: string;
  usertId: string;

  // ✅ الخصائص المحسوبة من AppUser
  totalShopPoints: number;
  totalFreePoints: number;
  totalPendingPoints: number;
  totalAllPoints: number;
}
