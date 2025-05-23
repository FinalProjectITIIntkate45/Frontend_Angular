export interface CategoryAttribute {
  Id: number;
  Name: string;
  DataType: 'String' | 'Int64' | 'Boolean' | 'DateTime' | 'Decimal' | 'Double';
  Icon?: string;
}
