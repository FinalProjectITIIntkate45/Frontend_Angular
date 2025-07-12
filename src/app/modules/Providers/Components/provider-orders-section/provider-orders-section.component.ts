import { Component, OnInit, OnDestroy, computed, signal } from '@angular/core';
import {
  OrderHubService,
  OrderUpdate,
} from '../../../../core/services/order-hub.service';
import { VendorService } from '../../Services/vendor.service';
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
export class ProviderOrdersSectionComponent implements OnInit, OnDestroy {
  orders = signal<ProviderOrderViewModel[]>([]);
  search = signal('');
  statusFilter = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  errorMessage = signal('');
  loading = signal(false);

  OrderStatus = OrderStatus;
  private shopId: number = 0;

  filteredOrders = computed(() => {
    const term = this.search().toLowerCase();
    const status = this.statusFilter().toLowerCase();

    return this.orders().filter((order) => {
      const matchesSearch =
        order.Id.toString().includes(term) ||
        order.CustomerInfo?.Name?.toLowerCase().includes(term);

      const matchesStatus = status
        ? order.Status?.toLowerCase() === status
        : true;

      return matchesSearch && matchesStatus;
    });
  });

  paginatedOrders = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredOrders().slice(start, start + this.pageSize());
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredOrders().length / this.pageSize())
  );

  constructor(
    private orderService: OrderService,
    private vendorService: VendorService,
    private orderHubService: OrderHubService
  ) {}

  ngOnInit(): void {
    this.loadOrders();

    this.vendorService.getVendorProfile().subscribe({
      next: (profile) => {
        this.shopId = profile.shopId;
        this.orderHubService
          .startConnection(`shop_${this.shopId}`)
          .then(() => {
            console.log('✅ OrderHub connection started successfully');
          })
          .catch((error) => {
            console.error('❌ Failed to start OrderHub connection:', error);
          });
        this.orderHubService.orderUpdates$.subscribe((update) => {
          if (update) {
            console.log('📥 update received in component:', update);
            this.handleOrderUpdate(update);
          }
        });
      },
      error: () => {
        this.errorMessage.set('❌ Failed to load vendor profile');
      },
    });
  }

  ngOnDestroy(): void {
    this.orderHubService.leaveGroup(`shop_${this.shopId}`);
    this.orderHubService.stopConnection();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.orderService
      .getProviderOrders(this.currentPage(), this.pageSize())
      .subscribe({
        next: (
          res: APIResponse<PaginatedResponse<ProviderOrderViewModel[]>>
        ) => {
          if (res.IsSuccess) {
            this.orders.set(res.Data.data);
          } else {
            this.errorMessage.set(res.Message || 'فشل في تحميل الطلبات');
          }
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('حدث خطأ أثناء تحميل الطلبات.');
          this.loading.set(false);
        },
      });
  }

  handleOrderUpdate(update: OrderUpdate): void {
    const updated = this.orders().map((order) =>
      order.Id === update.orderId ? { ...order, Status: update.status } : order
    );
    this.orders.set(updated);
  }

  updateOrderStatus(orderId: number, status: OrderStatus): void {
    this.orderService.updateOrderStatus(orderId, { status }).subscribe({
      next: () => this.loadOrders(),
      error: () => alert('فشل في تحديث حالة الطلب'),
    });
  }

  clearFilters(): void {
    this.search.set('');
    this.statusFilter.set('');
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((v) => v - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((v) => v + 1);
    }
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
