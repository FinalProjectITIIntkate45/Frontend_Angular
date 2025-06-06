export interface ProductFilter {
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  minPoints: number | null;
  maxPoints: number | null;
  search?: string;
  sortBy: string;
}
