export interface AuctionVM {
  id: number; // Primary Key
  materialId: number; // Foreign Key referencing RecyclingMaterial
  matrialname: string;
  governorate: number; // governorate enum value
  governorateName: string; // Computed property from governorate enum
  startTime: Date; // Auction start time
  endTime: Date; // Auction end time
  status: number; // ScrapAuctionStatus enum value
  auctionStatus: string; // Computed property from status enum
  createdAt: Date; // Auto-set timestamp when record is created
  insuranceAmount: number;
}
