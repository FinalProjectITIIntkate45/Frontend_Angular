import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OrderResponseViewModel } from '../../../Models/OrderResponseViewModel';
import { APIResponse } from '../../../../../core/models/APIResponse';
import { OrderService } from '../../../../../core/services/order.service';

@Component({
  selector: 'app-client-order-details',
  templateUrl: './client-order-details.component.html',
  standalone: false,
  styleUrls: ['./client-order-details.component.css'],
})
export class ClientOrderDetailsComponent implements OnInit {
  order: OrderResponseViewModel | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.orderService.getOrderById(id).subscribe({
        next: (res: APIResponse<OrderResponseViewModel>) => {
          if (res.IsSuccess) {
            this.order = res.Data;
          } else {
            this.errorMessage = res.Message ?? 'Failed to load order details';
          }
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Something went wrong';
          this.loading = false;
        },
      });
    }
  }
  // دالة لتحويل حالة الطلب من رقم إلى نص
  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Confirmed';
      case 2:
        return 'Shipped';
      case 3:
        return 'Delivered';
      case 4:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  // دالة لتحويل نوع الدفع من رقم إلى نص
  getPaymentTypeText(paymentType: number): string {
    switch (paymentType) {
      case 0:
        return 'PointsOnly';
      case 123456:
        return 'CashCollection';
      case 654321:
        return 'AcceptKiosk';
      case 789012:
        return 'MobileWallet';
      case 5044433:
        return 'PayPal';
      case 5044395:
        return 'OnlineCard';
      case 913666:
        return 'Paymob';
      case 504450:
        return 'CashOnDelivery';
      default:
        return 'Unknown';
    }
  }
}
