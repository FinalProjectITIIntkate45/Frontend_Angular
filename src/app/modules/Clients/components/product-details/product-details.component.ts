import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { Product } from '../../Models/Product.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  standalone: false,
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading: boolean = false;
  error: string | null = null;
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  private loadProduct(id: number) {
    this.loading = true;
    this.error = null;

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = error.error?.message || 'Failed to load product details';
        this.loading = false;
      },
    });
  }

  // Add this method if you want to implement the Add to Cart functionality
  addToCart() {
    // Implement cart functionality
    console.log('Adding to cart:', this.product?.Name);
  }

  addToWishlist() {
    // Implement wishlist functionality
    console.log('Adding to wishlist:', this.product?.Name);
  }
}
