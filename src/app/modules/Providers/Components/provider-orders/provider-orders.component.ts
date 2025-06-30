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
  authService: any;

  constructor(private providerOrdersService: ProviderOrdersService) {}

  ngOnInit(): void {
    const providerId = this.authService.getUserId();
    this.providerOrdersService.getProviderOrders(providerId).subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error('Error fetching orders', err)
    });
  }

  // دالة للحصول على صورة المنتج (افتراضية، يمكن تعديلها بناءً على API)
  getProductImage(productId: number): string {
    // هنا يمكنك إرجاع URL لصورة المنتج بناءً على productId (مثال)
    return `https://via.placeholder.com/50?text=Product+${productId}`;
  }

  // دالة لعرض تفاصيل الطلب (يمكن تطويرها لفتح modal أو صفحة جديدة)
  viewOrderDetails(order: ProviderOrder): void {
    console.log('Order Details:', order);
    // أضف هنا منطقًا لعرض التفاصيل (مثل فتح modal أو صفحة جديدة)
  }
}