import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderOrdersService } from '../../Services/provider-orders.service';
import { ProviderOrder, OrderStatus } from '../../Models/provider-orders.model';

@Component({
  selector: 'app-provider-orders',
  templateUrl: './provider-orders.component.html',
  styleUrls: ['./provider-orders.component.css'],
  standalone: false,
})
export class ProviderOrdersComponent implements OnInit {
  public OrderStatus = OrderStatus;
  orders: ProviderOrder[] = [];
  loading = false;
  error: string | null = null;
  selectedOrder: ProviderOrder | null = null;
  showOrderDetails = false;
  pageSize = 7;
  currentPage = 1;
  statusFilter: string = '';
  get filteredOrders(): ProviderOrder[] {
    if (!this.statusFilter) return this.orders;
    return this.orders.filter(
      (order) => order.Status?.toLowerCase() === this.statusFilter.toLowerCase()
    );
  }
  get paginatedOrders(): ProviderOrder[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }
  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.pageSize);
  }
  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  constructor(
    private providerOrdersService: ProviderOrdersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.providerOrdersService.getProviderOrders().subscribe({
      next: (response: any) => {
        // Try to extract the orders array from various possible response shapes
        let ordersArray = null;
        if (response?.data && Array.isArray(response.data)) {
          ordersArray = response.data;
        } else if (response?.Data && Array.isArray(response.Data)) {
          ordersArray = response.Data;
        } else if (response?.Data?.data && Array.isArray(response.Data.data)) {
          ordersArray = response.Data.data;
        }

        if (ordersArray) {
          this.orders = ordersArray
            .map((order: any) => ({
              ...order,
              customerInfo: order.CustomerInfo,
            }))
            .sort(
              (a: ProviderOrder, b: ProviderOrder) =>
                new Date(b.CreationDateTime).getTime() -
                new Date(a.CreationDateTime).getTime()
            );
        } else {
          // Only warn if we got an object instead of an array
          if (
            (response?.data &&
              typeof response.data === 'object' &&
              !Array.isArray(response.data)) ||
            (response?.Data &&
              typeof response.Data === 'object' &&
              !Array.isArray(response.Data))
          ) {
            console.warn(
              'Expected array for orders but got object:',
              response.data || response.Data
            );
          }
          this.orders = [];
          this.error =
            response?.Message || response?.message || 'No orders found';
        }

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching orders:', err);
        console.error('Error details:', {
          status: err.status,
          message: err.message,
          error: err.error,
        });

        if (err.status === 401) {
          this.error =
            'You are not authorized to view orders. Please login again.';
        } else if (err.status === 500) {
          this.error = 'Server error occurred. Please try again later.';
        } else if (err.status === 404) {
          this.error = 'Orders not found.';
        } else {
          this.error =
            err?.error?.Message ||
            err?.message ||
            'Failed to load orders. Please try again.';
        }

        this.loading = false;
      },
    });
  }

  getProductImage(productId: number): string {
    // Placeholder image - in real implementation, you'd get this from the product data
    return `https://via.placeholder.com/60x60?text=Product+${productId}`;
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'success':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning';
      case 'cancelled':
      case 'cancel':
        return 'badge bg-danger';
      case 'processing':
        return 'badge bg-info';
      case 'shipped':
        return 'badge bg-primary';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'success':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
      case 'cancel':
        return 'Cancelled';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      default:
        return status || 'Unknown';
    }
  }

  viewOrderDetails(order: ProviderOrder): void {
    this.router.navigate(['/provider/provider-orders', order.Id]);
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
    this.showOrderDetails = false;
  }

  updateOrderStatus(orderId: number, newStatus: OrderStatus): void {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    this.providerOrdersService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (response) => {
        console.log('Order status updated:', response);
        this.refreshOrders();
      },
      error: (err) => {
        console.error('Failed to update order status:', err);
        // Optionally show error to user
      },
    });
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  getTotalItems(order: ProviderOrder): number {
    return (
      order.OrderItems?.reduce((total, item) => total + item.Quantity, 0) || 0
    );
  }
}
