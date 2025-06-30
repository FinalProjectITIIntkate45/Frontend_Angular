export interface AuctionRecyclingRequestVM {
  auctionId: number;
  approvalTime?: Date;
}

export interface JoinAuctionResponse {
  success: boolean;
  message: string;
  data?: any;
} 