export interface AuctionRecyclingRequestVM {
  auctionId: number;
  approvalTime?: Date;
}

export interface JoinAuctionViewModel {
  recyclingRequestId: number;
  auctionId: number;
}

export enum AuctionRecyclingStatus {
  Pending = 1,
  Accepted = 2,
  Rejected = 3,
  Completed = 4
} 