export interface RecyclingMaterial {
  Id: number;
  Name: string;
  UnitType: UnitOfMeasurementType;
  PointsPerUnit: number;
  MaterialImage?: string;
  TotalRecyclingRequests?: number;
  TotalScrapAuctions?: number;
}

export enum UnitOfMeasurementType {
  Kilogram = 1,
  Gram = 2,
  Liter = 3,
  Milliliter = 4,
  Piece = 5,
  Meter = 6,
  Centimeter = 7,
}

export interface RecyclingMaterialCreateViewModel {
  name: string;
  unitType: UnitOfMeasurementType;
  pointsPerUnit: number;
  materialImage?: string;
  materialImageFile?: File;
} 