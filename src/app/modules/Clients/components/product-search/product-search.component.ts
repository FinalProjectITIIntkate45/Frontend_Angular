import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { ProductFilter } from '../../Models/Product-Filter.model';
import { Product } from '../../Models/Product.model';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css'],
  standalone: false,
})
export class ProductSearchComponent implements OnInit {
  allProducts: Product[] = []; // Store all products
  filteredProducts: Product[] = []; // Store filtered products
  categories: string[] = []; // Will be populated from unique product categories
  loading: boolean = false;
  error: string | null = null;

  filter: ProductFilter = {
    category: '',
    minPrice: null,
    maxPrice: null,
    minPoints: null,
    maxPoints: null,
    sortBy: 'price_asc',
  };

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = null;

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.extractCategories();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = error.error?.message || 'Failed to load products';
        this.loading = false;
      },
    });
  }

  private extractCategories() {
    this.categories = [...new Set(this.allProducts.map((p) => p.categoryName))];
  }

  searchProducts() {
    this.applyFilters();
  }

  clearFilters() {
    this.filter = {
      category: '',
      minPrice: null,
      maxPrice: null,
      minPoints: null,
      maxPoints: null,
      sortBy: 'price_asc',
    };
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.allProducts];

    // Apply category filter
    if (this.filter.category) {
      filtered = filtered.filter(
        (p) => p.categoryName === this.filter.category
      );
    }

    // Apply price range filter
    if (this.filter.minPrice !== null) {
      filtered = filtered.filter(
        (p) => p.displayedPrice >= this.filter.minPrice!
      );
    }
    if (this.filter.maxPrice !== null) {
      filtered = filtered.filter(
        (p) => p.displayedPrice <= this.filter.maxPrice!
      );
    }

    // Apply points range filter
    if (this.filter.minPoints !== null) {
      filtered = filtered.filter(
        (p) => p.earnedPoints >= this.filter.minPoints!
      );
    }
    if (this.filter.maxPoints !== null) {
      filtered = filtered.filter(
        (p) => p.earnedPoints <= this.filter.maxPoints!
      );
    }

    // Apply sorting
    switch (this.filter.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.displayedPrice - b.displayedPrice);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.displayedPrice - a.displayedPrice);
        break;
      case 'points_desc':
        filtered.sort((a, b) => b.earnedPoints - a.earnedPoints);
        break;
      case 'rating_desc':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    this.filteredProducts = filtered;
  }

  viewProductDetails(productId: number) {
    this.router.navigate(['/client/Product', productId]);
  }
}
