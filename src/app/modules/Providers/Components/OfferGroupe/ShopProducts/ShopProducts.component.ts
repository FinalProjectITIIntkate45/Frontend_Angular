import { Component, OnInit } from '@angular/core';
import { ProductDetailsViewModel } from '../../../Models/ProductDetailsViewModel';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OfferService } from '../../../Services/OfferServices.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shop-products',
  templateUrl: './ShopProducts.component.html',
  styleUrls: ['./ShopProducts.component.css'],
  standalone: false, // Changed to standalone
})
export class ShopProductsComponent implements OnInit {
  products: ProductDetailsViewModel[] = [];
  loading = true;
  errorMessage: string | null = null;
  filteredProducts: ProductDetailsViewModel[] = [];
  searchTerm = '';
  offerForm!: FormGroup;

  constructor(private offerService: OfferService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadProducts();
    this.offerForm = this.fb.group({
      startDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.offerService.getShopProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.errorMessage = 'فشل تحميل المنتجات. يرجى المحاولة لاحقاً';
        this.loading = false;
      }
    });
  }

  filterProducts(): void {
    if (!this.searchTerm) {
      this.filteredProducts = [...this.products];
      return;
    }
    
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  trackByProductId(index: number, product: ProductDetailsViewModel): number {
    return product.id;
  }
}