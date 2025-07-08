import { Component, OnInit } from '@angular/core';

import { OrderResponseViewModel } from '../../Models/OrderResponseViewModel';
import { APIResponse } from '../../../../core/models/APIResponse';
import { PaginatedResponse } from '../../../../core/models/PaginatedResponse';
import { OrderService } from '../../../../core/services/order.service';// لو معرفتش النوع دا، هنكتبه تحت

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

  // ✅ خصائص الباجينيشن
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalCount = 0;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // ✅ تحميل الطلبات مع pagination
  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cancelErrorMessage = '';
    this.cancelSuccessMessage = '';

    this.orderService.getClientOrders(this.pageNumber, this.pageSize).subscribe({
      next: (res: APIResponse<PaginatedResponse<OrderResponseViewModel[]>>) => {
        if (res.IsSuccess) {
          this.orders = res.Data.data;
          this.totalPages = res.Data.totalPages;
          this.totalCount = res.Data.totalCount;
          this.pageNumber = res.Data.pageNumber;
          this.pageSize = res.Data.pageSize;
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

  // ✅ الانتقال للصفحة التالية
  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadOrders();
    }
  }

  // ✅ الانتقال للصفحة السابقة
  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadOrders();
    }
  }

  // ✅ إلغاء الطلب
  cancelOrder(orderId: number): void {
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

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Confirmed';
      case 2: return 'Shipped';
      case 3: return 'Delivered';
      case 4: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getPaymentTypeText(paymentType: number): string {
    switch (paymentType) {
      case 0: return 'PointsOnly';
      case 123456: return 'CashCollection';
      case 654321: return 'AcceptKiosk';
      case 789012: return 'MobileWallet';
      case 5044433: return 'PayPal';
      case 5044395: return 'OnlineCard';
      case 913666: return 'Paymob';
      case 504450: return 'CashOnDelivery';
      default: return 'Unknown';
    }
  }

  canCancel(order: OrderResponseViewModel): boolean {
    return order.Status === 0 || order.Status === 1;
  }
}
