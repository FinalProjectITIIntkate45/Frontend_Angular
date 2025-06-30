import { Governorate } from './recycling-request.model';

export interface ScrapAuction {
  Id: number;
  Title: string;
  Description: string;
  StartingPrice: number;
  CurrentPrice: number;
  EndDate: Date;
  StartDate: Date;
  Status: AuctionStatus;
  Governorate: Governorate;
  City: string;
  Address: string;
  CreatedBy: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  ImageUrl?: string;
  MaxParticipants?: number;
  CurrentParticipants?: number;
  Category?: string;
  Weight?: number;
  UnitType?: string;
}

export enum AuctionStatus {
  Pending = 1,
  Active = 2,
  Completed = 3,
  Cancelled = 4,
  Expired = 5
}

export interface JoinAuctionViewModel {
  recyclingRequestId: number;
  auctionId: number;
}

export interface AuctionRecyclingRequest {
  Id: number;
  RecyclingRequestId: number;
  AuctionId: number;
  Status: AuctionRecyclingStatus;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export enum AuctionRecyclingStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Completed = 4
}

export interface AuctionListResponse {
  data: ScrapAuction[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
} 