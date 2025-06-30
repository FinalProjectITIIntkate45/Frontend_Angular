import { Governorate } from './recycling-request.model';

export enum governorate {
  Sohag = 0,
  Cairo = 1,
  Giza = 2,
  Alexandria = 3,
  Qalyubia = 4,
  Sharqia = 5,
  Gharbia = 6,
  Menoufia = 7,
  Dakahlia = 8,
  Beheira = 9,
  KafrElSheikh = 10,
  Damietta = 11,
  PortSaid = 12,
  Ismailia = 13,
  Suez = 14,
  MarsaMatrouh = 15,
  NorthSinai = 16,
  SouthSinai = 17,
  Fayoum = 18,
  BeniSuef = 19,
  Minya = 20,
  Assiut = 21,
  Qena = 22,
  Luxor = 23,
  Aswan = 24,
  RedSea = 25,
  NewValley = 26
}

export enum ScrapAuctionStatus {
  Active = 1,
  Completed = 2,
  Canceled = 3
}

export interface AuctionVM {
  Id: number;
  MaterialId: number;
  Matrialname: string;
  governorate: governorate;
  GovernorateName: string;
  StartTime: Date;
  EndTime: Date;
  Status: ScrapAuctionStatus;
  AuctionStatus: string;
  CreatedAt: Date;
  InsuranceAmount: number;
}

export enum AuctionStatus {
  Pending = 1,
  Active = 2,
  Completed = 3,
  Cancelled = 4,
  Expired = 5
} 