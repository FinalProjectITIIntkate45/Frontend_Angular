import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import {
  ProductFilter,
  ProductSearchRequest,
} from '../../Models/Product-Filter.model';
import { Product } from '../../Models/Product.model';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
  firstValueFrom,
} from 'rxjs';
import { CartServicesService } from '../../Services/CardServices.service';

// Enhanced Product interface with pre-calculated values
interface EnhancedProduct extends Product {
  rating: number;
  ratingCount: number;
}

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css'],
  standalone: false,
})
export class ProductSearchComponent implements OnInit, OnDestroy {
  allProducts: EnhancedProduct[] = [];
  filteredProducts: EnhancedProduct[] = [];
  displayedProducts: EnhancedProduct[] = [];
  categories: string[] = [];
  brands: { name: string; count: number }[] = [];
  loading: boolean = false;
  error: string | null = null;

  // Search functionality
  searchQuery: string = '';
  private searchSubject = new Subject<string>();
  private routeSubscription?: Subscription;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;
  totalItems: number = 0;

  // Math reference for template
  Math = Math;

  filter: ProductFilter = {
    category: '',
    minPrice: null,
    maxPrice: null,
    minPoints: null,
    maxPoints: null,
    sortBy: 'price_asc',
    saleOnly: false,
    sameDayDelivery: false,
    availableToOrder: false,
    selectedBrands: [],
    pageNumber: 1,
    pageSize: 12,
  };

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private cardservice: CartServicesService
  ) {
    // Setup debounced search
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.filter.search = searchTerm;
        this.currentPage = 1;
        this.performSearch();
      });
  }

  ngOnInit() {
    // Listen to route query parameters changes (including from navbar search)
    this.routeSubscription = this.route.queryParams.subscribe((params) => {
      const newSearchQuery = params['search'] || '';

      // Only update if search query actually changed
      if (this.searchQuery !== newSearchQuery) {
        this.searchQuery = newSearchQuery;
        this.filter.search = newSearchQuery;
        this.currentPage = 1;

        // If we have initial data, perform search immediately
        // Otherwise, loadInitialData will handle the first search
        if (this.categories.length > 0 || this.brands.length > 0) {
          this.performSearch();
        }
      }
    });

    this.loadInitialData();
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    this.searchSubject.complete();
  }

  private loadInitialData() {
    this.loading = true;
    this.error = null;

    // Load categories and brands first, then perform search
    Promise.all([this.loadCategories(), this.loadBrands()])
      .then(() => {
        this.performSearch();
      })
      .catch((error) => {
        console.error('Error loading initial data:', error);
        this.error = 'Failed to load initial data';
        this.loading = false;
      });
  }

  private async loadCategories(): Promise<void> {
    try {
      this.categories =
        (await firstValueFrom(this.productService.getCategories())) || [];
    } catch (error) {
      console.error('Error loading categories:', error);
      this.categories = [];
    }
  }

  private async loadBrands(): Promise<void> {
    try {
      const brandNames =
        (await firstValueFrom(this.productService.getBrands())) || [];
      this.brands = brandNames.map((name) => ({ name, count: 0 }));
    } catch (error) {
      console.error('Error loading brands:', error);
      this.brands = [];
    }
  }

  private performSearch() {
    this.loading = true;
    this.error = null;

    const searchRequest: ProductSearchRequest = {
      search: this.filter.search,
      category: this.filter.category || undefined,
      minPrice: this.filter.minPrice || undefined,
      maxPrice: this.filter.maxPrice || undefined,
      minPoints: this.filter.minPoints || undefined,
      maxPoints: this.filter.maxPoints || undefined,
      sortBy: this.filter.sortBy,
      saleOnly: this.filter.saleOnly,
      availableToOrder: this.filter.availableToOrder,
      selectedBrands: this.filter.selectedBrands?.length
        ? this.filter.selectedBrands
        : undefined,
      pageNumber: this.currentPage,
      pageSize: this.itemsPerPage,
    };

    this.productService.searchProducts(searchRequest).subscribe({
      next: (result) => {
        console.log('Search results:', result);

        // Update these lines to use PascalCase property names
        this.displayedProducts = (result.Products || []).map((product) => ({
          ...product,
          rating: this.generateRandomRating(),
          ratingCount: this.generateRandomRatingCount(),
        }));

        // Update pagination info with PascalCase properties
        this.totalItems = result.TotalItems;
        this.totalPages = result.TotalPages;
        this.currentPage = result.PageNumber;

        this.filteredProducts = this.displayedProducts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.error = error.error?.message || 'Failed to search products';
        this.loading = false;
      },
    });
  }

  // Generate random values once per product
  private generateRandomRating(): number {
    return Math.random() * 5;
  }

  private generateRandomRatingCount(): number {
    return Math.floor(Math.random() * 500) + 10;
  }

  // Search functionality
  onSearchQueryChange() {
    // Update URL query params to sync with navbar
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: this.searchQuery || null },
      queryParamsHandling: 'merge',
    });

    // Use the debounced search subject
    this.searchSubject.next(this.searchQuery);
  }

  searchProducts(): void {
    this.currentPage = 1; // Reset to first page when applying filters
    this.performSearch();
  }

  // Pagination methods
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.performSearch();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.performSearch();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.performSearch();
    }
  }

  // Filter helper methods
  clearFilters() {
    this.filter = {
      category: '',
      minPrice: null,
      maxPrice: null,
      minPoints: null,
      maxPoints: null,
      sortBy: 'price_asc',
      saleOnly: false,
      sameDayDelivery: false,
      availableToOrder: false,
      selectedBrands: [],
      pageNumber: 1,
      pageSize: 12,
    };
    this.searchQuery = '';
    this.currentPage = 1;

    // Clear URL params too
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: null },
      queryParamsHandling: 'merge',
    });
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filter.category ||
      this.filter.minPrice ||
      this.filter.maxPrice ||
      this.filter.minPoints ||
      this.filter.maxPoints ||
      this.filter.saleOnly ||
      this.filter.sameDayDelivery ||
      this.filter.availableToOrder ||
      (this.filter.selectedBrands && this.filter.selectedBrands.length > 0) ||
      (this.searchQuery && this.searchQuery.trim())
    );
  }

  clearCategoryFilter() {
    this.filter.category = '';
    this.currentPage = 1;
    this.performSearch();
  }

  clearPriceFilter() {
    this.filter.minPrice = null;
    this.filter.maxPrice = null;
    this.currentPage = 1;
    this.performSearch();
  }

  clearSearchFilter() {
    this.searchQuery = '';
    this.filter.search = '';
    this.currentPage = 1;

    // Clear URL params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: null },
      queryParamsHandling: 'merge',
    });
  }

  toggleBrand(brandName: string) {
    if (!this.filter.selectedBrands) {
      this.filter.selectedBrands = [];
    }

    const index = this.filter.selectedBrands.indexOf(brandName);
    if (index > -1) {
      this.filter.selectedBrands.splice(index, 1);
    } else {
      this.filter.selectedBrands.push(brandName);
    }
    this.currentPage = 1;
    this.performSearch();
  }

  getCategoryCount(category: string): number {
    // This would need to be implemented based on server response
    // For now, return 0 as placeholder
    return 0;
  }

  // Product helper methods
  viewProductDetails(productId: number) {
    this.router.navigate(['/client/products', productId]);
  }

  getDiscountPercentage(product: Product): number {
    if (product.DisplayedPriceAfterDiscount >= product.DisplayedPrice) {
      return 0;
    }
    const discount =
      product.DisplayedPrice - product.DisplayedPriceAfterDiscount;
    return Math.round((discount / product.DisplayedPrice) * 100);
  }

  isNewProduct(product: Product): boolean {
    if (!product.CreatedAt) return false;
    const createdDate = new Date(product.CreatedAt);
    const now = new Date();
    const diffInDays =
      (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
    return diffInDays <= 30;
  }

  // Now these methods return the pre-calculated values
  getRating(product: EnhancedProduct): number {
    return product.rating;
  }

  getRatingCount(product: EnhancedProduct): number {
    return product.ratingCount;
  }

  addToCart(product: Product, event: Event) {
    event.stopPropagation();

    if (product.Stock === 0) {
      return;
    }

    console.log('[AddToCart-Search] Sending:', {
      productId: product.Id,
      quantity: 1,
      price: product.DisplayedPriceAfterDiscount || product.DisplayedPrice,
      points: product.Points,
    });
    // Use the same logic as product-details.component.ts
    this.cardservice
      .addToCart(
        product.Id,
        1, // Default quantity to 1 in search page
        product.DisplayedPriceAfterDiscount || product.DisplayedPrice,
        product.Points
      )
      .subscribe(
        (response) => {
          alert(`Added 1 ${product.Name} to cart!`);
        },
        (error) => {
          console.error('Error adding product to cart:', error);
          alert('Failed to add item to cart. Please try again.');
        }
      );
  }

  // Pagination helper methods
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  shouldShowFirstPage(): boolean {
    return this.currentPage > 3;
  }

  shouldShowLastPage(): boolean {
    return this.currentPage < this.totalPages - 2;
  }

  shouldShowFirstEllipsis(): boolean {
    return this.currentPage > 4;
  }

  shouldShowLastEllipsis(): boolean {
    return this.currentPage < this.totalPages - 3;
  }
}
