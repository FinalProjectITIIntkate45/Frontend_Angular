import { Component, OnInit } from '@angular/core';

import { OrderResponseViewModel } from '../../Models/OrderResponseViewModel';
import { APIResponse } from '../../../../core/models/APIResponse';
import { OrderService } from '../../../../core/services/order.service';



@Component({
  selector: 'app-orders-section',
  standalone:false,
  templateUrl: './orders-section.component.html',
  styleUrls: ['./orders-section.component.css']
})
export class OrdersSectionComponent implements OnInit {
  orders: OrderResponseViewModel[] = [];
  loading = true;
  errorMessage = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getClientOrders().subscribe({
      next: (res: APIResponse<OrderResponseViewModel[]>) => {
        if (res.IsSuccess) {
          this.orders = res.Data;
        } else {
          this.errorMessage = res.Message || 'Failed to load orders';
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء تحميل الطلبات';
        this.loading = false;
      }
    });
  }
}
