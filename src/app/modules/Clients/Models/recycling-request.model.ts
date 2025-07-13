import { UnitOfMeasurementType } from './recycling-material.model';

export enum Governorate {
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

export interface RecyclingRequestCreateViewModel {
  MaterialId: number;
  UnitType: UnitOfMeasurementType;
  RequestImage?: string;
  City: string;
  Address: string;
  Quantity: number;
  Governorate: Governorate;
}

export interface RecyclingRequestListItemViewModel {
  Id: number;
  MaterialName: string;
  UnitType: UnitOfMeasurementType;
  Quantity: number;
  Status: RecyclingRequestStatus;
  PointsAwarded?: number;
  CreatedAt: Date;
}

export interface RecyclingRequestDetailsViewModel {
  Id: number;
  MaterialName: string;
  UnitType: UnitOfMeasurementType;
  Quantity: number;
  Status: RecyclingRequestStatus;
  PointsAwarded?: number;
  RequestImage?: string;
  ClientUsername: string;
  CreatedAt: Date;
}

export interface RecyclingRequestEditViewModel {
  Id: number;
  Status: RecyclingRequestStatus;
  PointsAwarded?: number;
  UnitType: UnitOfMeasurementType;
  RequestImage?: string;
}

export interface RecyclingRequestAfterAuctionVm {
  Id: number;
  Address: string;
  Quantity: number;
  PendingmMoneyAfterAuction?: number;
  ReturnType: ReturnType;
  CreatedAt: Date;
  MaterialId: number;
  RecyclerName: string;
}

export enum RecyclingRequestStatus {
  Pending = 1,
  Accepted = 2,
  Rejected = 3,
  Completed = 4,
}

export enum ReturnType {
  Waiting = 0,
  Money = 1,
  Point = 2,
}
