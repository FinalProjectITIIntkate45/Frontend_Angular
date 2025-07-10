import { UnitOfMeasurementType } from "../../Clients/Models/recycling-material.model";
import { Governorate } from "../../Clients/Models/recycling-request.model";
import { ScrapAuctionStatus } from "./scrap-auction-status.enum";


export interface AuctionRoomVM {
  Id: number; // Primary Key
  MaterialId: number; // Foreign Key referencing RecyclingMaterial
  Matrialname: string;

  governorate: Governorate; // Required: Stores the auction location

  // GovernorateName is derived from governorate enum value
  GovernorateName: string;

  StartTime: Date; // Auction start time
  EndTime: Date; // Auction end time

  Status: ScrapAuctionStatus; // Enum: Active, Completed, Canceled

  // AuctionStatus is derived from Status enum value
  AuctionStatus: string;

  CreatedAt: Date; // Auto-set timestamp when record is created

  InsuranceAmount: number;

  quantity: number;

  UnitType: UnitOfMeasurementType;

  RequestsCount: number;
}