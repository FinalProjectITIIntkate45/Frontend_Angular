import { Component, OnInit } from '@angular/core';
import { OfferProductViewModel } from '../../../Models/OfferProductViewModel';
import { ProductDetailsViewModel } from '../../../Models/ProductDetailsViewModel';
import { OfferViewModel } from '../../../Models/OfferViewModel';
import { AddOfferProductVM } from '../../../Models/AddOfferProductVM';
import { EditOfferProductVM } from '../../../Models/EditOfferProductVM';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../../../Services/OfferServices.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './EditOffer.component.html',
  styleUrls: ['./EditOffer.component.css'],
  standalone: false,
})
export class EditOfferComponent implements OnInit {
  offerId!: number;
  offer!: OfferViewModel;
  mainProducts: OfferProductViewModel[] = [];
  bonusProducts: OfferProductViewModel[] = [];
  shopProducts: ProductDetailsViewModel[] = [];
  loading = true;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offerService: OfferService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.offerId = +this.route.snapshot.paramMap.get('id')!;
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    // Load offer details and shop products in parallel
    Promise.all([
      this.loadOfferDetails(),
      this.loadShopProducts()
    ]).finally(() => this.loading = false);
  }

  loadOfferDetails(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.offerService.getOfferDetails(this.offerId).subscribe({
        next: (offer: OfferViewModel) => {
          this.offer = offer;
          this.mainProducts = offer.Products.filter(p => p.Type === 0);
          this.bonusProducts = offer.Products.filter(p => p.Type === 1);
          resolve();
        },
        error: (err) => {
          this.toastr.error('Failed to load offer details');
          console.error('Error loading offer products:', err);
          reject(err);
        }
      });
    });
  }

  loadShopProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.offerService.getShopProducts().subscribe({
        next: (products) => {
          this.shopProducts = products;
          resolve();
        },
        error: (err) => {
          this.toastr.error('Failed to load shop products');
          console.error('Error loading shop products:', err);
          reject(err);
        }
      });
    });
  }

  getProductById(productId: number): ProductDetailsViewModel | undefined {
    return this.shopProducts.find(p => p.id === productId);
  }

  addProduct(type: number): void {
    if (this.isOfferActive()) {
      this.toastr.warning('Cannot add products to an active offer');
      return;
    }

    if (!this.shopProducts || this.shopProducts.length === 0) {
      this.toastr.error('Product list is not available. Please try again.', 'Error');
      return;
    }

    const selectedProduct = this.shopProducts[0];
    const newProduct: OfferProductViewModel = {
      Id: 0,
      ProductId: selectedProduct?.id || 0,
      ProductName: selectedProduct?.name || 'Unknown Product',
      ProductQuantity: 1,
      Type: type
    };

    if (!newProduct.ProductId) {
      this.toastr.error('No valid products found to add.', 'Error');
      return;
    }
    
    if (type === 0) {
      this.mainProducts.push(newProduct);
    } else {
      this.bonusProducts.push(newProduct);
    }
  }

  onProductChange(event: any, product: OfferProductViewModel): void {
    if (this.isOfferActive()) {
      this.toastr.warning('Cannot edit products in an active offer');
      return;
    }

    const selectedProductId = parseInt(event.target.value);
    product.ProductId = selectedProductId;
    
    // Update the product name when product changes
    const selectedProduct = this.shopProducts.find(p => p.id === selectedProductId);
    product.ProductName = selectedProduct?.name || 'Unknown Product';
  }

  removeProduct(list: OfferProductViewModel[], index: number): void {
    if (this.isOfferActive()) {
      this.toastr.warning('Cannot remove products from an active offer');
      return;
    }

    const product = list[index];
    
    if (product.Id) {
      // If product has an ID, it exists in the database
      this.offerService.deleteOfferProduct(product.Id).subscribe({
        next: () => {
          list.splice(index, 1);
          this.toastr.success('Product removed successfully');
        },
        error: (err) => {
          this.toastr.error('Failed to remove product');
          console.error('Error removing product:', err);
        }
      });
    } else {
      // If no ID, just remove from local array
      list.splice(index, 1);
    }
  }

  saveChanges(): void {
    if (this.isOfferActive()) {
      this.toastr.warning('Cannot save changes to an active offer');
      return;
    }

    this.saving = true;
    const allProducts = [...this.mainProducts, ...this.bonusProducts];
    const saveOperations: Promise<void>[] = [];

    for (const product of allProducts) {
      if (product.Id) {
        // Update existing product
        const editProduct: EditOfferProductVM = {
          Id: product.Id,
          ProductId: product.ProductId,
          ProductName: product.ProductName,
          ProductQuantity: product.ProductQuantity,
          Type: product.Type,
          offerid: this.offerId
        };
        saveOperations.push(this.offerService.updateOfferProduct(editProduct).toPromise() || Promise.resolve());
      } else {
        // Add new product
        const addProduct: AddOfferProductVM = {
          ProductId: product.ProductId,
          ProductName: product.ProductName,
          ProductQuantity: product.ProductQuantity,
          Type: product.Type,
          offerid: this.offerId
        };
        saveOperations.push(this.offerService.addProductToOffer(addProduct).toPromise() || Promise.resolve());
      }
    }

    // Execute all save operations
    Promise.all(saveOperations)
      .then(() => {
        this.toastr.success('Products saved successfully');
        this.router.navigate(['/provider/ShowShopOffer']);
      })
      .catch(err => {
        this.toastr.error('Failed to save some products');
        console.error('Error saving products:', err);
      })
      .finally(() => this.saving = false);
  }

  trackByFn(index: number, item: OfferProductViewModel): number {
    return item.Id || index;
  }

  isOfferActive(): boolean {
    if (!this.offer) return false;
    return this.offer.Status === 1; // Assuming Status 1 means active
  }

  getOfferStatusText(): string {
    if (!this.offer) return '';
    return this.offer.Status === 1 ? 'Active' : 'Inactive';
  }

  getOfferStatusClass(): string {
    if (!this.offer) return '';
    return this.offer.Status === 1 ? 'bg-success' : 'bg-secondary';
  }

  cancel(): void {
    this.router.navigate(['/provider/ShowShopOffer']);
  }
}