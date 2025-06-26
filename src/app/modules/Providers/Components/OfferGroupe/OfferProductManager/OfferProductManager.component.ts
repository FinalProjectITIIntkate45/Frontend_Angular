import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OfferService } from '../../../Services/OfferServices.service';
import { ProductDetailsViewModel } from '../../../Models/ProductDetailsViewModel';
import { OfferProductViewModel } from '../../../Models/OfferProductViewModel';
import { OfferViewModel } from '../../../Models/OfferViewModel';
import { AddOfferProductVM } from '../../../Models/AddOfferProductVM';
import { EditOfferProductVM } from '../../../Models/EditOfferProductVM';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-offer-product-manager',
  templateUrl: './OfferProductManager.component.html',
  styleUrls: ['./OfferProductManager.component.css'],
  standalone: false,
})
export class OfferProductManagerComponent implements OnInit {
  offerId!: number;
  offer!: OfferViewModel;
  shopProducts: ProductDetailsViewModel[] = [];
  
  offerProducts: OfferProductViewModel[] = [];
  originalOfferProducts: OfferProductViewModel[] = [];

  loading = true;
  saving = false;

  newProduct: AddOfferProductVM = {
    ProductId: 0,
    ProductQuantity: 1,
    Type: 0,
    offerid: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offerService: OfferService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.offerId = +this.route.snapshot.paramMap.get('offerId')!;
    this.newProduct.offerid = this.offerId;
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.offerService.getShopProducts().subscribe({
      next: (products) => {
        this.shopProducts = products;
        this.loadOfferDetails();
      },
      error: (err) => {
        this.toastr.error('Failed to load shop products');
        this.loading = false;
      },
    });
  }

  loadOfferDetails(): void {
    this.offerService.getOfferDetails(this.offerId).subscribe({
      next: (offer: OfferViewModel) => {
        this.offer = offer;
        this.offerProducts = this.deepCopy(offer.Products);
        this.originalOfferProducts = this.deepCopy(offer.Products);
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load offer details');
        this.loading = false;
      },
    });
  }

  addProduct(): void {
    if (this.isOfferActive()) {
      this.toastr.warning('Cannot add products to an active offer.');
      return;
    }

    if (this.newProduct.ProductId === 0) {
      this.toastr.warning('Please select a product.');
      return;
    }

    const isProductInOffer = this.offerProducts.some(p => p.ProductId === this.newProduct.ProductId);
    if (isProductInOffer) {
      this.toastr.error('This product is already in the offer.');
      return;
    }

    this.saving = true;
    const selectedProduct = this.shopProducts.find(p => p.id === this.newProduct.ProductId);
    if (!selectedProduct) {
      this.toastr.error('Selected product not found.');
      this.saving = false;
      return;
    }

    const productToAdd: AddOfferProductVM = {
      ...this.newProduct,
      ProductName: selectedProduct.name,
    };

    this.offerService.addProductToOffer(productToAdd).subscribe({
      next: () => {
        this.toastr.success('Product added successfully.');
        this.loadOfferDetails();
        this.resetNewProductForm();
        this.saving = false;
      },
      error: (err) => {
        this.toastr.error('Failed to add product.');
        this.saving = false;
      },
    });
  }

  removeProduct(productId: number, index: number): void {
    if (this.isOfferActive()) {
      this.toastr.warning('Cannot remove products from an active offer.');
      return;
    }

    if (!confirm('Are you sure you want to remove this product?')) {
      return;
    }

    this.saving = true;
    this.offerService.deleteOfferProduct(productId).subscribe({
      next: () => {
        this.toastr.success('Product removed successfully.');
        this.offerProducts.splice(index, 1);
        this.originalOfferProducts.splice(index, 1);
        this.saving = false;
      },
      error: (err) => {
        this.toastr.error('Failed to remove product.');
        this.saving = false;
      },
    });
  }

  saveChanges(): void {
    if (this.isOfferActive()) {
      this.toastr.warning('Cannot edit products in an active offer.');
      return;
    }

    this.saving = true;
    const updateObservables = this.offerProducts
      .map((product, index) => {
        const originalProduct = this.originalOfferProducts[index];
        if (this.isProductChanged(product, originalProduct)) {
          const productToUpdate: EditOfferProductVM = {
            Id: product.Id || 0,
            ProductId: product.ProductId,
            ProductQuantity: product.ProductQuantity,
            Type: product.Type,
            offerid: this.offerId,
          };
          return this.offerService.updateOfferProduct(productToUpdate).pipe(
            catchError(error => {
              this.toastr.error(`Failed to update product: ${this.getProductName(product.ProductId)}`);
              return of(null);
            })
          );
        }
        return null;
      })
      .filter(Boolean);

    if (updateObservables.length === 0) {
      this.toastr.info('No changes to save.');
      this.saving = false;
      return;
    }

    forkJoin(updateObservables).subscribe({
      next: () => {
        this.toastr.success('All changes saved successfully.');
        this.originalOfferProducts = this.deepCopy(this.offerProducts);
        this.saving = false;
      },
      error: () => {
        this.toastr.error('An error occurred while saving changes.');
        this.saving = false;
      },
    });
  }

  cancelChanges(): void {
    this.offerProducts = this.deepCopy(this.originalOfferProducts);
    this.toastr.info('Changes have been cancelled.');
  }

  hasChanges(): boolean {
    return JSON.stringify(this.offerProducts) !== JSON.stringify(this.originalOfferProducts);
  }

  private isProductChanged(p1: OfferProductViewModel, p2: OfferProductViewModel): boolean {
    return p1.ProductQuantity !== p2.ProductQuantity || p1.Type !== p2.Type;
  }

  private deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  resetNewProductForm(): void {
    this.newProduct = {
      ProductId: 0,
      ProductQuantity: 1,
      Type: 0,
      offerid: this.offerId,
    };
  }

  getProductName(productId: number): string {
    const product = this.shopProducts.find(p => p.id === productId);
    return product ? product.name : 'Unknown';
  }

  isOfferActive(): boolean {
    return this.offer && this.offer.Status === 1;
  }

  goBack(): void {
    this.router.navigate(['/provider/ShowShopOffer']);
  }
}