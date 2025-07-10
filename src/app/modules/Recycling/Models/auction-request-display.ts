export interface AuctionRecyclingRequestDisplyVM {
  recyclingRequestId: number;
  auctionId: number;
  status: number;
  insuranceAmount: number;
  approvalTime?: Date;
  matrialName: string;
  city: string;
}
