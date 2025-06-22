import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddOffer } from '../../../Models/AddOffer';
import { OfferProductViewModel } from '../../../Models/OfferProductViewModel';
import { ProductDetailsViewModel } from '../../../Models/ProductDetailsViewModel';
import { OfferService } from '../../../Services/OfferServices.service';

@Component({
  selector: 'app-make-offer',
  templateUrl: './MakeOffer.component.html',
  styleUrls: ['./MakeOffer.component.css'],
  standalone: false
})
export class MakeOfferComponent implements OnInit {
  offerForm: FormGroup;
  shopProducts: ProductDetailsViewModel[] = [];
  offerProducts: OfferProductViewModel[] = [];
  loading = true;
  submitting = false;
  today = new Date().toISOString().split('T')[0];
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    private offerService: OfferService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.offerForm = this.fb.group({
      oldPrice: [0, [Validators.required, Validators.min(0)]],
      newPrice: [0, [Validators.required, Validators.min(0)]],
      oldPoints: [0, [Validators.required, Validators.min(0)]],
      newPoints: [0, [Validators.required, Validators.min(0)]],
      startDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      status: [true]
    });
  }

  ngOnInit(): void {
    this.loadShopProducts();
  }

  loadShopProducts(): void {
    this.loading = true;
    console.log('[MakeOfferComponent] Starting to load shop products...');
    this.offerService.getShopProducts().subscribe({
      next: (products) => {
        console.log('[MakeOfferComponent] Successfully received products:', products);
        if (!products || products.length === 0) {
          console.warn('[MakeOfferComponent] Product array is empty or null.');
          this.toastr.warning('No products were found for your shop.');
        }
        this.shopProducts = products || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('[MakeOfferComponent] Encountered an error loading products:', err);
        this.toastr.error('A critical error occurred while loading products. Please check console.', 'Load Failed');
        this.shopProducts = [];
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addProduct(type: number): void {
    if (!this.shopProducts || this.shopProducts.length === 0) {
      this.toastr.error('Product list is not available. Please try again.', 'Error');
      return;
    }

    const availableProduct = this.shopProducts.find(p => p.stock > 0);
    const defaultProductId = availableProduct ? availableProduct.id : this.shopProducts[0].id;

    if (!defaultProductId) {
      this.toastr.error('No valid products found to add.', 'Error');
      return;
    }
    
    const selectedProduct = this.shopProducts.find(p => p.id === defaultProductId);
    
    this.offerProducts.push({
      ProductId: defaultProductId,
      ProductName: selectedProduct?.name || 'Unknown Product',
      ProductQuantity: 1,
      Type: type
    });

    const typeName = type === 0 ? 'Main' : 'Bonus';
    this.toastr.success(`Added ${typeName} product to offer`);

    this.calculateTotals();
  }

  removeProduct(index: number): void {
    this.offerProducts.splice(index, 1);
    this.calculateTotals();
  }

  getProductName(productId: number): string {
    if (!productId || productId <= 0) {
      return 'No product selected';
    }
    
    const product = this.shopProducts.find(p => p.id === productId);
    if (!product) {
      return 'Product not found';
    }
    
    return `${product.name || 'Unknown Product'} (${product.stock || 0} in stock)`;
  }

  getProductDetails(productId: number): { name: string; price: number; stock: number; category: string } {
    const product = this.shopProducts.find(p => p.id === productId);
    if (!product) {
      return { name: 'Product not found', price: 0, stock: 0, category: 'Unknown' };
    }
    
    return {
      name: product.name || 'Unknown Product',
      price: product.basePrice || 0,
      stock: product.stock || 0,
      category: product.categoryName || 'Unknown Category'
    };
  }

  onProductChange(event: any, index: number): void {
    const selectedProductId = parseInt(event.target.value);
    
    if (this.offerProducts[index]) {
      this.offerProducts[index].ProductId = selectedProductId;
      
      // Update the product name when product changes
      const selectedProduct = this.shopProducts.find(p => p.id === selectedProductId);
      this.offerProducts[index].ProductName = selectedProduct?.name || 'Unknown Product';
    }
    this.calculateTotals();
  }

  onQuantityChange(): void {
    this.calculateTotals();
  }

  calculateTotals(): void {
    let totalOldPrice = 0;
    let totalOldPoints = 0;

    for (const offerProduct of this.offerProducts) {
      const shopProduct = this.shopProducts.find(p => p.id === offerProduct.ProductId);
      if (shopProduct) {
        totalOldPrice += (shopProduct.basePrice || 0) * (offerProduct.ProductQuantity || 0);
        totalOldPoints += (shopProduct.points || 0) * (offerProduct.ProductQuantity || 0);
      }
    }

    this.offerForm.patchValue({
      oldPrice: totalOldPrice.toFixed(2),
      oldPoints: totalOldPoints
    });
  }

  trackByProductId(index: number, product: ProductDetailsViewModel): number {
    return product.id;
  }

  saveOffer(): void {
    if (this.offerForm.invalid) {
      this.toastr.warning('Please fill all required fields correctly');
      return;
    }

    if (!this.selectedFile) {
      this.toastr.warning('Please select an image for the offer');
      return;
    }

    if (this.offerProducts.length === 0) {
      this.toastr.warning('Please add at least one product to the offer');
      return;
    }

    this.submitting = true;

    const offerData: AddOffer = {
      OfferImgUrl: '',
      file: this.selectedFile,
      Status: this.offerForm.value.status ? 1 : 0,
      OldPrice: this.offerForm.value.oldPrice,
      NewPrice: this.offerForm.value.newPrice,
      OldPoints: this.offerForm.value.oldPoints,
      NewPoints: this.offerForm.value.newPoints,
      StartDate: this.offerForm.value.startDate + 'T' + this.offerForm.value.startTime,
      EndDate: this.offerForm.value.endDate + 'T' + this.offerForm.value.endTime,
      Products: this.offerProducts
    };

    console.log('Submitting the following offer data to the service:', offerData);

    this.offerService.addNewOffer(offerData).subscribe({
      next: () => {
        this.toastr.success('Offer created successfully');
        this.router.navigate(['/provider/ShowShopOffer']);
      },
      error: (err) => {
        this.toastr.error('Failed to create offer');
        console.error('Error creating offer:', err);
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/provider/ShowShopOffer']);
  }

  get mainProducts() {
    return this.offerProducts.filter(p => p.Type === 0);
  }
  
  get bonusProducts() {
    return this.offerProducts.filter(p => p.Type === 1);
  }

  get offerSummary() {
    if (this.offerProducts.length === 0) {
      return 'No products added';
    }

    const mainCount = this.mainProducts.length;
    const bonusCount = this.bonusProducts.length;
    const totalItems = this.offerProducts.reduce((sum, p) => sum + p.ProductQuantity, 0);
    
    let summary = `${totalItems} total items`;
    if (mainCount > 0) summary += ` (${mainCount} main, ${bonusCount} bonus)`;
    
    return summary;
  }
}