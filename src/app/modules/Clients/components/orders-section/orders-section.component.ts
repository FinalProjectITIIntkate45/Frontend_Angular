import {
  OrderHubService,
  OrderUpdate,
} from '../../../../core/services/order-hub.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { OrderResponseViewModel } from '../../Models/OrderResponseViewModel';
import { APIResponse } from '../../../../core/models/APIResponse';
import { OrderService } from '../../../../core/services/order.service';
import { OrderStatus } from '../../Models/order-status.enum';
import { PaginatedResponse } from '../../../../core/models/PaginatedResponse';
import { AuthService } from '../../../../core/services/Auth.service';
import { OrderItemViewModel } from '../../Models/OrderItemViewModel';

@Component({
  selector: 'app-orders-section',
  standalone: false,
  templateUrl: './orders-section.component.html',
  styleUrls: ['./orders-section.component.css'],
})
export class OrdersSectionComponent implements OnInit, OnDestroy {
  orders: OrderResponseViewModel[] = [];
  filteredOrders: OrderResponseViewModel[] = [];
  loading = true;
  errorMessage = '';

  // Filtering and search
  searchControl = new FormControl('');
  statusFilter = new FormControl('');
  selectedStatus: string = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Available statuses for filtering
  availableStatuses = [
    { value: '', label: 'All Status' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Canceled', label: 'Canceled' },
  ];

  private orderUpdatesSubscription!: Subscription;
  private authSubscription!: Subscription;
  private currentUserId: string = '';

  constructor(
    private orderService: OrderService,
    private orderHubService: OrderHubService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService
      .getAuthState()
      .subscribe((authState) => {
        if (authState.isAuthenticated && authState.user) {
          this.currentUserId = authState.user.userName || '';

          // بدء اتصال SignalR والانضمام للمجموعة
          this.orderHubService.startConnection();
          this.orderHubService.joinGroup(`user_${this.currentUserId}`);

          // الاشتراك في التحديثات الحية
          this.orderUpdatesSubscription =
            this.orderHubService.orderUpdates$.subscribe((update) => {
              if (update) {
                this.handleOrderUpdate(update);
              }
            });
        }
      });

    this.loadOrders();
    this.setupSearchListener();
  }

  ngOnDestroy(): void {
    if (this.orderUpdatesSubscription)
      this.orderUpdatesSubscription.unsubscribe();
    if (this.authSubscription) this.authSubscription.unsubscribe();
    if (this.currentUserId)
      this.orderHubService.leaveGroup(`user_${this.currentUserId}`);
    this.orderHubService.stopConnection();
  }

  private handleOrderUpdate(update: OrderUpdate): void {
    const index = this.orders.findIndex((o) => o.Id === update.orderId);
    if (index !== -1) {
      // تحديث حالة الطلب
      this.orders[index].Status = this.mapStatusFromString(update.status);
      this.applyFilters();
    }
  }

  private mapStatusFromString(status: string): OrderStatus {
    switch (status.toLowerCase()) {
      case 'pending':
        return OrderStatus.Pending;
      case 'confirmed':
        return OrderStatus.Confirmed;
      case 'shipped':
        return OrderStatus.Shipped;
      case 'delivered':
        return OrderStatus.Delivered;
      case 'canceled':
        return OrderStatus.Canceled;
      default:
        return OrderStatus.Pending;
    }
  }

  // ... (باقي الكود كما هو مع التحديثات والفلاتر)

  private setupSearchListener(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService
      .getClientOrders(this.currentPage, this.pageSize)
      .subscribe({
        next: (
          res: APIResponse<PaginatedResponse<OrderResponseViewModel[]>>
        ) => {
          if (res.IsSuccess) {
            this.orders = res.Data.data;
            this.totalItems = res.Data.totalCount;
            this.applyFilters();
          } else {
            this.errorMessage = res.Message || 'Failed to load orders';
          }
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'حدث خطأ أثناء تحميل الطلبات';
          this.loading = false;
        },
      });
  }

  applyFilters(): void {
    // تطبيق الفلاتر حسب البحث والحالة مع إعادة تحميل الصفحة إلى 1 عند التغيير
    let filtered = [...this.orders];
    const searchTerm = this.searchControl.value?.toLowerCase();

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.Id.toString().includes(searchTerm) ||
          order.Items.some(
            (item) =>
              item.ProductName?.toLowerCase().includes(searchTerm) ||
              item.ShopName?.toLowerCase().includes(searchTerm)
          )
      );
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(
        (order) =>
          OrderStatus[order.Status].toLowerCase() ===
          this.selectedStatus.toLowerCase()
      );
    }

    this.filteredOrders = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  onStatusFilterChange(event: any): void {
    this.selectedStatus = event.target.value;
    this.applyFilters();
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Confirmed:
      case OrderStatus.Delivered:
        return 'badge bg-success';
      case OrderStatus.Pending:
        return 'badge bg-warning';
      case OrderStatus.Canceled:
        return 'badge bg-danger';
      case OrderStatus.Shipped:
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusText(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Confirmed:
        return 'Confirmed';
      case OrderStatus.Pending:
        return 'Pending';
      case OrderStatus.Canceled:
        return 'Canceled';
      case OrderStatus.Shipped:
        return 'Shipped';
      case OrderStatus.Delivered:
        return 'Delivered';
      default:
        return 'Unknown';
    }
  }

  getPaymentMethodText(paymentType: any): string {
    // Handle both number and string types
    if (typeof paymentType === 'number') {
      switch (paymentType) {
        case 123456:
          return 'Cash Collection';
        case 654321:
          return 'Accept Kiosk';
        case 789012:
          return 'Mobile Wallet';
        case 5044433:
          return 'PayPal';
        case 5044395:
          return 'Online Card';
        case 913666:
          return 'Paymob';
        case 504450:
          return 'Cash on Delivery';
        case 0:
          return 'Points Only';
        case 873645:
          return 'Stripe';
        case 304235:
          return 'Wallet';
        default:
          return paymentType.toString();
      }
    }
    const type = paymentType?.toString()?.toLowerCase();
    switch (type) {
      case 'cashcollection':
        return 'Cash Collection';
      case 'acceptkiosk':
        return 'Accept Kiosk';
      case 'mobilewallet':
        return 'Mobile Wallet';
      case 'paypal':
        return 'PayPal';
      case 'onlinecard':
        return 'Online Card';
      case 'paymob':
        return 'Paymob';
      case 'cashondelivery':
        return 'Cash on Delivery';
      case 'pointsonly':
        return 'Points Only';
      case 'stripe':
        return 'Stripe';
      case 'wallet':
        return 'Wallet';
      default:
        return paymentType?.toString() || 'Unknown';
    }
  }

  getPaymentMethodClass(paymentType: any): string {
    const type = paymentType?.toString()?.toLowerCase();
    switch (type) {
      case 'paypal':
        return 'text-primary';
      case 'stripe':
        return 'text-success';
      case 'cod':
        return 'text-warning';
      case 'wallet':
        return 'text-info';
      default:
        return 'text-secondary';
    }
  }

  getProductImage(order: OrderResponseViewModel): string {
    // Get the first product image from the order items
    const firstItem = order.Items?.[0];
    return firstItem?.Image || '';
  }

  getProductName(order: OrderResponseViewModel): string {
    const firstItem = order.Items?.[0];
    return firstItem?.ProductName || `Product #${firstItem?.ProductId}`;
  }

  getTotalItems(order: OrderResponseViewModel): number {
    return (
      order.Items?.reduce(
        (total: number, item: OrderItemViewModel) => total + item.Quantity,
        0
      ) || 0
    );
  }

  // Pagination methods
  get paginatedOrders(): OrderResponseViewModel[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredOrders.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.selectedStatus = '';
    this.statusFilter.setValue('');
    this.applyFilters();
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    // Use a simple data URL for placeholder instead of external file
    imgElement.src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNSAyNUMyNy43NjE0IDI1IDMwIDIyLjc2MTQgMzAgMjBDMzAgMTcuMjM4NiAyNy43NjE0IDE1IDI1IDE1QzIyLjIzODYgMTUgMjAgMTcuMjM4NiAyMCAyMEMyMCAyMi43NjE0IDIyLjIzODYgMjUgMjUgMjVaIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0yNSAzNUMyNy43NjE0IDM1IDMwIDMyLjc2MTQgMzAgMzBDMzAgMjcuMjM4NiAyNy43NjE0IDI1IDI1IDI1QzIyLjIzODYgMjUgMjAgMjcuMjM4NiAyMCAzMEMyMCAzMi43NjE0IDIyLjIzODYgMzUgMjUgMzVaIiBmaWxsPSIjQ0NDIi8+Cjwvc3ZnPgo=';
    imgElement.onerror = null; // Prevent infinite loop
  }

  cancelOrder(order: OrderResponseViewModel): void {
    if (order.Status !== OrderStatus.Pending) return;
    this.orderService
      .updateOrderStatus(order.Id, { status: OrderStatus.Canceled })
      .subscribe({
        next: (res) => {
          this.loadOrders();
        },
        error: (err) => {
          console.error('Failed to cancel order:', err);
        },
      });
  }
}
