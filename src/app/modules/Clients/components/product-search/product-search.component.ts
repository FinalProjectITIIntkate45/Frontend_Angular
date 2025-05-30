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
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
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
        console.log('Products loaded:', products);
        this.allProducts = products || [];

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
    if (!this.allProducts?.length) {
      this.categories = [];
      return;
    }
    this.categories = [...new Set(this.allProducts.map((p) => p.CategoryName))];
  }

  searchProducts(): void {
    this.applyFilters();
  }

  private applyFilters() {
    if (!this.allProducts?.length) {
      this.filteredProducts = [];
      return;
    }

    let filtered = [...this.allProducts];

    if (this.filter.category) {
      filtered = filtered.filter(
        (p) => p.CategoryName === this.filter.category
      );
    }

    if (this.filter.minPrice !== null) {
      filtered = filtered.filter(
        (p) => p.DisplayedPrice >= this.filter.minPrice!
      );
    }
    if (this.filter.maxPrice !== null) {
      filtered = filtered.filter(
        (p) => p.DisplayedPrice <= this.filter.maxPrice!
      );
    }

    if (this.filter.minPoints !== null) {
      filtered = filtered.filter(
        (p) => p.EarnedPoints >= this.filter.minPoints!
      );
    }
    if (this.filter.maxPoints !== null) {
      filtered = filtered.filter(
        (p) => p.EarnedPoints <= this.filter.maxPoints!
      );
    }

    switch (this.filter.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.DisplayedPrice - b.DisplayedPrice);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.DisplayedPrice - a.DisplayedPrice);
        break;
      case 'points_desc':
        filtered.sort((a, b) => b.EarnedPoints - a.EarnedPoints);
        break;
      // case 'rating_desc':
      //   filtered.sort((a, b) => (b.Rat || 0) - (a.rating || 0));
      //   break;
    }

    this.filteredProducts = filtered;
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

  viewProductDetails(productId: number) {
    this.router.navigate(['/client/Product', productId]);
  }
}
