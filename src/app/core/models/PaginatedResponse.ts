export interface PaginatedResponse<T> {
  data: T;          // ✅ حرف صغير
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
