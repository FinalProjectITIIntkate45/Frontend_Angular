import { Component, OnInit } from '@angular/core';

import { OrderResponseViewModel } from '../../Models/OrderResponseViewModel';
import { APIResponse } from '../../../../core/models/APIResponse';
import { OrderService } from '../../../../core/services/order.service';

@Component({
  selector: 'app-orders-section',
  standalone: false,
  templateUrl: './orders-section.component.html',
  styleUrls: ['./orders-section.component.css'],
})
export class OrdersSectionComponent implements OnInit {
  orders: OrderResponseViewModel[] = [];
  loading = true;
  errorMessage = '';
  cancelErrorMessage = '';
  cancelSuccessMessage = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.errorMessage = '';
    this.cancelErrorMessage = '';
    this.cancelSuccessMessage = '';
    this.orderService.getClientOrders().subscribe({
      next: (res: APIResponse<OrderResponseViewModel[]>) => {
        if (res.IsSuccess) {
          this.orders = res.Data;
          console.log(this.orders);
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

  // تحديد إذا يمكن إلغاء الطلب حسب الحالة
  canCancel(order: OrderResponseViewModel): boolean {
    return order.Status === 0 || order.Status === 1; // 0 = Pending, 1 = Confirmed
  }

  // إلغاء الطلب
  cancelOrder(orderId: number) {
    this.cancelErrorMessage = '';
    this.cancelSuccessMessage = '';
    this.orderService.updateOrderStatus(orderId, 4).subscribe({
      next: (res) => {
        if (res.IsSuccess) {
          this.cancelSuccessMessage = 'Order cancelled successfully.';
          this.loadOrders();
        } else {
          this.cancelErrorMessage = res.Message || 'Failed to cancel order.';
        }
      },
      error: () => {
        this.cancelErrorMessage = 'حدث خطأ أثناء إلغاء الطلب';
      },
    });
  }
}
