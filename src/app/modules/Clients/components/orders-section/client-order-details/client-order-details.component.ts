import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OrderResponseViewModel } from '../../../Models/OrderResponseViewModel';
import { APIResponse } from '../../../../../core/models/APIResponse';
import { OrderService } from '../../../../../core/services/order.service';


@Component({
  selector: 'app-client-order-details',
  templateUrl: './client-order-details.component.html',
  standalone : false,
  styleUrls: ['./client-order-details.component.css']
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
        }
      });
    }
  }
}
