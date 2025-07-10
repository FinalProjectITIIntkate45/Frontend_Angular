import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { ProviderOrderViewModel } from '../../Models/ProviderOrderViewModel';
import { ProviderOrdersService } from '../../Services/provider-orders.service';
import { OrderStatus } from '../../Models/provider-orders.model';

@Component({
  selector: 'app-provider-order-details',
  templateUrl: './provider-order-details.component.html',
  styleUrls: ['./provider-order-details.component.css'],
  standalone: false,
})
export class ProviderOrderDetailsComponent implements OnInit {
  order: any = null;
  loading = true;
  errorMessage = '';

  // Status management
  statusControl = new FormControl(OrderStatus.Pending);
  availableStatuses = [
    { value: OrderStatus.Pending, label: 'Pending' },
    { value: OrderStatus.Confirmed, label: 'Confirmed' },
    { value: OrderStatus.Shipped, label: 'Shipped' },
    { value: OrderStatus.Delivered, label: 'Delivered' },
    { value: OrderStatus.Canceled, label: 'Canceled' },
  ];

  // Notes
  notesControl = new FormControl('');
  isUpdatingStatus = false;
  isSavingNotes = false;

  // Notifications
  showSuccessMessage = false;
  showErrorMessage = false;
  notificationMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private providerOrdersService: ProviderOrdersService
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.errorMessage = 'Order ID not found';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.providerOrdersService.getOrderById(+orderId).subscribe({
      next: (res: any) => {
        const data = res.Data ? res.Data : res;
        this.order = data;
        if (this.order) {
          this.statusControl.setValue(this.order.Status);
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'حدث خطأ أثناء تحميل الطلب';
        this.loading = false;
      },
    });
  }

  updateOrderStatus(): void {
    if (
      !this.order ||
      this.statusControl.value === null ||
      this.statusControl.value === undefined
    )
      return;
    this.isUpdatingStatus = true;
    this.providerOrdersService
      .updateOrderStatus(this.order.Id, this.statusControl.value)
      .subscribe({
        next: (res: any) => {
          this.order.Status = this.statusControl.value;
          this.showSuccessNotification(
            `Order status updated to ${this.statusControl.value}`
          );
          this.isUpdatingStatus = false;
        },
        error: (error) => {
          this.isUpdatingStatus = false;
          this.showErrorNotification(
            'Error updating order status. Please try again.'
          );
        },
      });
  }

  // Map status number to string
  getStatusString(status: number): string {
    switch (status) {
      case 0:
        return 'pending';
      case 1:
        return 'confirmed';
      case 2:
        return 'shipped';
      case 3:
        return 'delivered';
      case 4:
        return 'canceled';
      default:
        return 'unknown';
    }
  }
  // Map status string to number
  getStatusNumber(status: string): number {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      case 'canceled':
        return 4;
      default:
        return 0;
    }
  }

  getStatusClass(status: any): string {
    const statusStr =
      typeof status === 'number' ? this.getStatusString(status) : status;
    switch (statusStr) {
      case 'confirmed':
      case 'delivered':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning';
      case 'canceled':
        return 'badge bg-danger';
      case 'shipped':
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusText(status: any): string {
    const statusStr =
      typeof status === 'number' ? this.getStatusString(status) : status;
    switch (statusStr) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'canceled':
        return 'Canceled';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      default:
        return statusStr;
    }
  }

  getProductImage(item: any): string {
    return item.Image || 'assets/product-placeholder.png';
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/product-placeholder.png';
  }

  goBack(): void {
    this.router.navigate(['/provider/provider-orders']);
  }

  getSubTotal(): number {
    if (!this.order || !this.order.Items) return 0;
    return this.order.Items.reduce(
      (sum: number, item: any) =>
        sum + (item.Price || 0) * (item.Quantity || 0),
      0
    );
  }

  getShippingCost(): number {
    return 0;
  }

  getGrandTotal(): number {
    return this.getSubTotal() + this.getShippingCost();
  }

  getPaymentMethodText(paymentType: any): string {
    if (!paymentType) return 'Unknown';
    switch (paymentType) {
      case 'CashOnDelivery':
        return 'Cash on Delivery';
      case 'PayPal':
        return 'PayPal';
      case 'Stripe':
        return 'Stripe';
      case 'Wallet':
        return 'Wallet';
      default:
        return paymentType;
    }
  }

  // Notification helper methods
  private showSuccessNotification(message: string): void {
    this.notificationMessage = message;
    this.showSuccessMessage = true;
    this.showErrorMessage = false;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }

  private showErrorNotification(message: string): void {
    this.notificationMessage = message;
    this.showErrorMessage = true;
    this.showSuccessMessage = false;
    setTimeout(() => {
      this.showErrorMessage = false;
    }, 5000);
  }

  // Quick action methods for common status updates
  markAsShipped(): void {
    if (!this.order) return;
    this.statusControl.setValue(OrderStatus.Shipped);
    this.updateOrderStatus();
  }

  markAsDelivered(): void {
    if (!this.order) return;
    this.statusControl.setValue(OrderStatus.Delivered);
    this.updateOrderStatus();
  }

  cancelOrder(): void {
    if (!this.order) return;
    this.statusControl.setValue(OrderStatus.Canceled);
    this.updateOrderStatus();
  }

  saveNotes(): void {
    if (!this.order) return;
    this.isSavingNotes = true;
    // TODO: Implement notes saving to backend
    setTimeout(() => {
      console.log('Notes saved:', this.notesControl.value);
      this.isSavingNotes = false;
    }, 1000);
  }

  downloadInvoice(): void {
    if (!this.order) return;
    // TODO: Implement invoice download
    console.log('Downloading invoice for order:', this.order.id);
  }

  confirmOrder(): void {
    if (!this.order) return;
    this.statusControl.setValue(OrderStatus.Confirmed);
    this.updateOrderStatus();
  }
}
