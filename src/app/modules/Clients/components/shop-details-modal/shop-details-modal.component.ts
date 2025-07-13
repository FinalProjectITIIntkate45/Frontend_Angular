import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ShopViewModel } from '../../Models/shop-view-model';

@Component({
  selector: 'app-shop-details-modal',
  templateUrl: './shop-details-modal.component.html',
  styleUrls: ['./shop-details-modal.component.css'],
  standalone: false,
})
export class ShopDetailsModalComponent {
  @Input() shop: ShopViewModel | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
