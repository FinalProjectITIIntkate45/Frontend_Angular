export interface RecyclingRequestAfterAuctionModel {
  id: number;
  governorate: string; // أو enum إذا عندك
  city: string;
  address: string;
  unitType: string; // أو enum إذا عندك
  quantity: number;
  status: number; // أو enum إذا عندك
  pendingmMoneyAfterAuction?: number;
  pointsAwarded?: number;
  moneyAward?: number;
  returnType: number; // أو enum إذا عندك
  createdAt: string;
} 