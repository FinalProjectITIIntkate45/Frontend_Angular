import { AuctionBidStatus } from "./AuctionBidStatus.enum";

export interface AuctionBidViewModel {
  bidAmount: number;
  status: AuctionBidStatus;
  createdAt: string;
  recyclerName?: string;
}