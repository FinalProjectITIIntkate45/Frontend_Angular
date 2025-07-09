import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { OrderResponseViewModel } from '../../Models/OrderResponseViewModel';
import { OrderItemViewModel } from '../../Models/OrderItemViewModel';
import { APIResponse } from '../../../../core/models/APIResponse';
import { OrderService } from '../../../../core/services/order.service';
import { OrderStatus } from '../../Models/order-status.enum';

@Component({
  selector: 'app-orders-section',
  standalone: false,
  standalone: false,
  templateUrl: './orders-section.component.html',
  styleUrls: ['./orders-section.component.css'],
  styleUrls: ['./orders-section.component.css'],
})
export class OrdersSectionComponent implements OnInit {
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

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
    this.setupSearchListener();
  }

  private setupSearchListener(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.applyFilters();
      });
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getClientOrders().subscribe({
      next: (res: APIResponse<OrderResponseViewModel[]>) => {
        console.log('Orders API Response:', res);
        if (res.IsSuccess) {
          this.orders = res.Data;
          console.log('Orders loaded:', this.orders);
          this.totalItems = this.orders.length;
          this.applyFilters();
        } else {
          this.errorMessage = res.Message || 'Failed to load orders';
          console.error('API Error:', res.Message);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('HTTP Error:', error);
        this.errorMessage = 'حدث خطأ أثناء تحميل الطلبات';
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchTerm) ||
          order.items.some(
            (item) =>
              item.name?.toLowerCase().includes(searchTerm) ||
              item.shopName?.toLowerCase().includes(searchTerm)
          )
      );
    }

    // Apply status filter
    if (this.selectedStatus) {
      console.log('Filtering by status:', this.selectedStatus);
      filtered = filtered.filter((order) => {
        const orderStatusText = OrderStatus[order.status];
        const matches =
          orderStatusText.toLowerCase() === this.selectedStatus.toLowerCase();
        console.log(
          `Order ${order.id}: status=${order.status}, statusText="${orderStatusText}", matches=${matches}`
        );
        return matches;
      });
    }

    this.filteredOrders = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1; // Reset to first page when filtering
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
    const firstItem = order.items?.[0];
    return firstItem?.image || '';
  }

  getProductName(order: OrderResponseViewModel): string {
    const firstItem = order.items?.[0];
    return firstItem?.name || `Product #${firstItem?.productId}`;
  }

  getTotalItems(order: OrderResponseViewModel): number {
    return (
      order.items?.reduce(
        (total: number, item: OrderItemViewModel) => total + item.quantity,
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
    if (order.status !== OrderStatus.Pending) return;
    this.orderService
      .updateOrderStatus(order.id, OrderStatus.Canceled)
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
