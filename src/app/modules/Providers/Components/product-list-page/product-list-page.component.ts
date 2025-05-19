import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.css']
})
export class ProductListPageComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService , private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  editProduct(product: Product): void {
    console.log('Edit clicked for', product);
    // Navigate or open edit modal here
  }
  viewProductDetails(id: number): void {
  this.router.navigate(['/provider/products/details', id]);
}

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.products = this.products.filter(p => p.id !== id);
      });
    }
  }
}
