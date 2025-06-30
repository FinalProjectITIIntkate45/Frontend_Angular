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
  materialId: number;
  unitType: UnitOfMeasurementType;
  requestImage?: string;
  city: string;
  address: string;
  quantity: number;
  governorate: Governorate;
}

export interface RecyclingRequestListItemViewModel {
  id: number;
  materialName: string;
  unitType: UnitOfMeasurementType;
  quantity?: number;
  status: RecyclingRequestStatus;
  pointsAwarded?: number;
  createdAt: Date;
}

export interface RecyclingRequestDetailsViewModel {
  id: number;
  materialName: string;
  unitType: UnitOfMeasurementType;
  status: RecyclingRequestStatus;
  pointsAwarded?: number;
  requestImage?: string;
  clientUsername: string;
  createdAt: Date;
}

export interface RecyclingRequestEditViewModel {
  id: number;
  status: RecyclingRequestStatus;
  pointsAwarded?: number;
  unitType: UnitOfMeasurementType;
  requestImage?: string;
}

export enum RecyclingRequestStatus {
  Pending = 1,
  Accepted = 2,
  Rejected = 3,
  Completed = 4,
} 