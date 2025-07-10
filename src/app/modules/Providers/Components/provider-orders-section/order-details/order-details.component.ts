import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderOrderViewModel } from '../../../Models/ProviderOrderViewModel';
import { OrderStatus } from '../../../Models/provider-orders.model';
import { OrderService } from '../../../../../core/services/order.service';
import { APIResponse } from '../../../../../core/models/APIResponse';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  standalone: false,
})
export class OrderDetailsComponent implements OnInit {
  orderId!: number;
  order?: ProviderOrderViewModel;
  loading = false;
  errorMessage = '';
  OrderStatus = OrderStatus;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(+idParam)) {
      this.errorMessage = 'Invalid order ID';
      return;
    }

    this.orderId = +idParam;
    this.fetchOrderDetails();
  }

  fetchOrderDetails(): void {
    this.loading = true;
    this.orderService.getOrderByIdProvider(this.orderId).subscribe({
      next: (res: APIResponse<ProviderOrderViewModel>) => {
        if (res.IsSuccess) {
          this.order = res.Data;
          console.log(this.order);
        } else {
          this.errorMessage = res.Message || 'Failed to load order';
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Something went wrong while loading order details';
        this.loading = false;
      },
    });
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
