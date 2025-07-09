import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OrderService } from '../../../../core/services/order.service';
import { ProviderOrderViewModel } from '../../Models/ProviderOrderViewModel';

import { APIResponse } from '../../../../core/models/APIResponse';
import { PaginatedResponse } from '../../../../core/models/PaginatedResponse';
import { OrderStatus } from '../../Models/provider-orders.model';

@Component({
  selector: 'app-provider-orders-section',

  templateUrl: './provider-orders-section.component.html',
  styleUrls: ['./provider-orders-section.component.css'],
  standalone: false,
})
export class ProviderOrdersSectionComponent implements OnInit {
  orders: ProviderOrderViewModel[] = [];
  filteredOrders: ProviderOrderViewModel[] = [];

  searchControl = new FormControl('');
  statusFilter = new FormControl('');
  selectedStatus: string = '';

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  loading = false;
  errorMessage = '';

  OrderStatus = OrderStatus;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
    this.setupSearchListener();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService
      .getProviderOrders(this.currentPage, this.pageSize)
      .subscribe({
        next: (
          res: APIResponse<PaginatedResponse<ProviderOrderViewModel[]>>
        ) => {
          if (res.IsSuccess) {
            this.orders = res.Data.data;
            this.totalItems = res.Data.totalCount;
            this.applyFilters();
          } else {
            this.errorMessage = res.Message || 'Failed to load orders.';
          }
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'حدث خطأ أثناء تحميل الطلبات.';
          this.loading = false;
        },
      });
  }

  setupSearchListener(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    let filtered = [...this.orders];
    const searchTerm = this.searchControl.value?.toLowerCase();

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchTerm) ||
          order.CustomerInfoS?.Name?.toLowerCase().includes(searchTerm)
      );
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(
        (order) =>
          order.status?.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }

    this.filteredOrders = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  updateOrderStatus(orderId: number, status: OrderStatus): void {
    this.orderService.updateOrderStatus(orderId, { status }).subscribe({
      next: () => this.loadOrders(),
      error: () => alert('فشل في تحديث حالة الطلب'),
    });
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.statusFilter.setValue('');
    this.selectedStatus = '';
    this.applyFilters();
  }

  onStatusFilterChange(event: any): void {
    this.selectedStatus = event.target.value;
    this.applyFilters();
  }

  get paginatedOrders(): ProviderOrderViewModel[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning';
      case 'cancelled':
        return 'badge bg-danger';
      case 'processing':
        return 'badge bg-info';
      case 'shipped':
        return 'badge bg-primary';
      default:
        return 'badge bg-secondary';
    }
  }
}
