export interface AuctionRecyclingRequestDisplyVM {
  recyclingRequestId: number;
  auctionId: number;
  status: AuctionRecyclingStatus;
  insuranceAmount: number;
  approvalTime?: Date;
  matrialName: string;
  city: string;
}

export enum AuctionRecyclingStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Withdrawn = 3
} 