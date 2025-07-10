import { Component, OnInit } from '@angular/core';
import { ProviderOrdersService } from '../../Services/provider-orders.service';

@Component({
  selector: 'app-provider-dashboard',
  templateUrl: './provider-dashboard.component.html',
  styleUrls: ['./provider-dashboard.component.css'],
  standalone: false,
})
export class ProviderDashboardComponent implements OnInit {
  orderStats = {
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    cancelled: 0,
  };
  loading = false;
  error: string | null = null;

  constructor(private providerOrdersService: ProviderOrdersService) {}

  ngOnInit(): void {
    this.loadOrderStats();
  }

  loadOrderStats(): void {
    this.loading = true;
    this.error = null;

    this.providerOrdersService.getProviderOrders().subscribe({
      next: (response: any) => {
        console.log('Orders response:', response);

        if (response && response.IsSuccess && response.Data) {
          const orders = response.Data;
          this.calculateStats(orders);
        } else {
          this.orderStats = {
            total: 0,
            pending: 0,
            confirmed: 0,
            processing: 0,
            shipped: 0,
            cancelled: 0,
          };
          this.error = response?.Message || 'No orders found';
        }

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching orders:', err);

        if (err.status === 401) {
          this.error =
            'You are not authorized to view order statistics. Please login again.';
        } else if (err.status === 500) {
          this.error = 'Server error occurred. Please try again later.';
        } else if (err.status === 404) {
          this.error = 'Order statistics not found.';
        } else {
          this.error =
            err?.error?.Message ||
            err?.message ||
            'Failed to load order statistics.';
        }

        this.loading = false;
      },
    });
  }

  calculateStats(orders: any[]): void {
    this.orderStats = {
      total: orders.length,
      pending: orders.filter((o) => o.status?.toLowerCase() === 'pending')
        .length,
      confirmed: orders.filter((o) => o.status?.toLowerCase() === 'confirmed')
        .length,
      processing: orders.filter((o) => o.status?.toLowerCase() === 'processing')
        .length,
      shipped: orders.filter((o) => o.status?.toLowerCase() === 'shipped')
        .length,
      cancelled: orders.filter(
        (o) =>
          o.status?.toLowerCase() === 'cancelled' ||
          o.status?.toLowerCase() === 'cancel'
      ).length,
    };
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'success';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  refreshStats(): void {
    this.loadOrderStats();
  }
}
