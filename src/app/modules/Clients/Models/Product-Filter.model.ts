// 1. Update the ProductFilter interface
import { Product } from './Product.model'; // Adjust the import path as necessary
export interface ProductFilter {
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  minPoints: number | null;
  maxPoints: number | null;
  search?: string;
  sortBy: string;
  saleOnly?: boolean;
  sameDayDelivery?: boolean;
  availableToOrder?: boolean;
  selectedBrands?: string[];
  pageNumber?: number;
  pageSize?: number;
}

// 2. Add new interfaces for search
export interface ProductSearchRequest {
  search?: string;
  category?: string;
  minPrice: number | null;
  maxPrice: number | null;
  minPoints: number | null;
  maxPoints: number | null;
  sortBy?: string;
  saleOnly?: boolean;
  availableToOrder?: boolean;
  selectedBrands?: string[];
  pageNumber?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  products: T[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductSearchResult {
  Products: Product[];
  TotalItems: number;
  PageNumber: number;
  PageSize: number;
  TotalPages: number;
  HasNextPage: boolean;
  HasPreviousPage: boolean;
}
