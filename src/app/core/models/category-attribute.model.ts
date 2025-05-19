export interface CategoryAttribute {
  id: number;
  name: string;
  dataType: 'String' | 'Int64' | 'Boolean' | 'DateTime' | 'Decimal' | 'Double';
  icon?: string;
}
