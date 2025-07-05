import { Component, OnInit } from '@angular/core';
import { ProviderOrdersService } from '../../Services/provider-orders.service';
import { ProviderOrder } from '../../Models/provider-orders.model';

@Component({
  selector: 'app-provider-orders',
  templateUrl: './provider-orders.component.html',
  styleUrls: ['./provider-orders.component.css'],
  standalone: false,
})
export class ProviderOrdersComponent implements OnInit {
  orders: ProviderOrder[] = [];
  loading = false;
  error: string | null = null;
  selectedOrder: ProviderOrder | null = null;
  showOrderDetails = false;

  constructor(private providerOrdersService: ProviderOrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.providerOrdersService.getProviderOrders().subscribe({
      next: (response: any) => {
        console.log('Orders response:', response);
        console.log('Response IsSuccess:', response?.IsSuccess);
        console.log('Response Data:', response?.Data);
        console.log('Response Message:', response?.Message);

        if (response && response.IsSuccess && response.Data) {
          this.orders = response.Data;
          console.log('Orders loaded successfully:', this.orders);
          console.log('Number of orders:', this.orders.length);
        } else {
          this.orders = [];
          this.error = response?.Message || 'No orders found';
          console.log('No orders found or error:', this.error);
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
    this.selectedOrder = order;
    this.showOrderDetails = true;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
    this.showOrderDetails = false;
  }

  updateOrderStatus(orderId: number, newStatus: string): void {
    // TODO: Implement order status update
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    // You would call a service method here to update the order status
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
