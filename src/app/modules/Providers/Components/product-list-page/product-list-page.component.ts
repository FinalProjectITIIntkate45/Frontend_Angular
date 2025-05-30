import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-product-list-page',
  standalone: false,
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.css']
})
export class ProductListPageComponent implements OnInit {
  products: Product[] = [];
  pagedProducts: Product[] = [];


  pageSize: number = 6;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res;
        this.totalPages = Math.ceil(this.products.length / this.pageSize);
        this.updatePagedProducts();
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.toastr.error('Failed to load products');
      }
    });
  }

  updatePagedProducts(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedProducts = this.products.slice(start, end);
    console.log('Paged Products:', this.pagedProducts);
  }


  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedProducts();
    }
  }

  totalPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  viewProductDetails(id: number): void {
    this.router.navigate(['/provider/products/details', id]);
  }

  editProduct(product: Product): void {
    this.router.navigate(['/provider/products/edit', product.id]);
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.toastr.success('Product deleted successfully');
          // Remove product from list
          this.products = this.products.filter(p => p.id !== id);
          this.totalPages = Math.ceil(this.products.length / this.pageSize);
          this.updatePagedProducts();
        },
        error: (err) => {
          this.toastr.error('Failed to delete product');
          console.error('Failed to delete product', err);
        }
      });
    }
  }
}
