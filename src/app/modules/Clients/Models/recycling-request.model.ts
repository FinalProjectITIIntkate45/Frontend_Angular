import { UnitOfMeasurementType } from './recycling-material.model';

export interface RecyclingRequestCreateViewModel {
  materialId: number;
  unitType: UnitOfMeasurementType;
  requestImage?: string;
  city: string;
  address: string;
  quantity: number;
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
