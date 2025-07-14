import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../Services/product.service';
import { Product } from '../../Models/Product.model';
import {
  ProductFilter,
  ProductSearchRequest,
  ProductSearchResult,
} from '../../Models/Product-Filter.model';
import { Router } from '@angular/router';
import { CartServicesService } from '../../Services/CardServices.service';

// Extend Product for badge support
interface ProductWithBadges extends Product {
  IsBestSeller?: boolean;
  IsNew?: boolean;
}

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css'],
  standalone: false,
})
export class ProductSearchComponent implements OnInit {
  products: ProductWithBadges[] = [];
  categories: string[] = [];
  brands: string[] = [];
  productFilter: ProductFilter = {
    category: '',
    minPrice: null,
    maxPrice: null,
    minPoints: null,
    maxPoints: null,
    search: '',
    sortBy: 'nameAsc',
    saleOnly: false,
    sameDayDelivery: false,
    availableToOrder: false,
    selectedBrands: [],
  };

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 6; // Display 9 products per page
  totalItems: number = 0;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartServicesService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();
    this.applyFilters();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  loadBrands(): void {
    this.productService.getBrands().subscribe((brands) => {
      this.brands = brands;
    });
  }

  applyFilters(): void {
    const searchRequest: ProductSearchRequest = {
      ...this.productFilter,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
    };

    this.productService
      .searchProducts(searchRequest)
      .subscribe((result: ProductSearchResult) => {
        this.products = result.Products;
        this.totalItems = result.TotalItems;
        this.totalPages = result.TotalPages;
        this.updatePagination();
      });
  }

  resetFilters(): void {
    this.productFilter = {
      category: '',
      minPrice: null,
      maxPrice: null,
      minPoints: null,
      maxPoints: null,
      search: '',
      sortBy: 'nameAsc',
      saleOnly: false,
      sameDayDelivery: false,
      availableToOrder: false,
      selectedBrands: [],
    };
    this.currentPage = 1;
    this.applyFilters();
  }

  onBrandChange(event: any): void {
    const brand = event.target.value;
    if (event.target.checked) {
      this.productFilter.selectedBrands?.push(brand);
    } else {
      this.productFilter.selectedBrands =
        this.productFilter.selectedBrands?.filter((b) => b !== brand);
    }
    this.applyFilters();
  }

  // Pagination methods
  updatePagination(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  // Navigate to product details page
  viewProductDetails(productId: number): void {
    if (productId) {
      this.router.navigate(['/products', productId]);
    }
  }

  // Add to cart stub (to be implemented)
  addToCart(product: ProductWithBadges, event: Event): void {
    event.stopPropagation();
    // Robust add/update logic (no duplicates)
    this.cartService.getCartItems().subscribe({
      next: (cart) => {
        const productId = Number(product.Id);
        const existingItem = cart.Items?.find(
          (item) => Number(item.productVM?.Id) === productId
        );
        if (existingItem && existingItem.cartItemId != null) {
          // Update quantity (try update first)
          const newQty = (existingItem.qty ?? 1) + 1;
          this.cartService
            .updateCartItemQuantity(existingItem.cartItemId as number, newQty)
            .subscribe(
              () => {
                this.cartService.refreshCartItemsCount();
                alert(`Updated quantity for ${product.Name} in cart!`);
              },
              (error) => {
                // If update fails, remove and add
                if (existingItem.cartItemId != null) {
                  this.cartService
                    .removeFromCart(existingItem.cartItemId as number)
                    .subscribe({
                      next: () => {
                        this.cartService
                          .addToCart(
                            product.Id,
                            newQty,
                            product.DisplayedPriceAfterDiscount ||
                              product.DisplayedPrice,
                            product.Points
                          )
                          .subscribe(
                            () => {
                              this.cartService.refreshCartItemsCount();
                              alert(
                                `Added ${newQty} ${product.Name}(s) to cart!`
                              );
                            },
                            () => {
                              alert('Failed to add item to cart.');
                            }
                          );
                      },
                      error: () => {
                        alert('Failed to update or replace cart item.');
                      },
                    });
                } else {
                  alert(
                    'Cart item ID is missing. Cannot update or remove cart item.'
                  );
                }
              }
            );
        } else if (!existingItem) {
          // Add new item
          this.cartService
            .addToCart(
              product.Id,
              1,
              product.DisplayedPriceAfterDiscount || product.DisplayedPrice,
              product.Points
            )
            .subscribe({
              next: () => {
                this.cartService.refreshCartItemsCount();
                alert(`Added ${product.Name} to cart!`);
              },
              error: () => {
                alert('Failed to add to cart. Please try again.');
              },
            });
        } else {
          alert('Cart item ID is missing. Cannot update cart.');
        }
      },
      error: () => {
        alert('Failed to fetch cart items.');
      },
    });
  }

  // Returns true if any filter is active (not default values)
  hasActiveFilters(): boolean {
    const f = this.productFilter;
    return !!(
      f.category ||
      f.minPrice !== null ||
      f.maxPrice !== null ||
      f.minPoints !== null ||
      f.maxPoints !== null ||
      f.search ||
      f.sortBy !== 'nameAsc' ||
      f.saleOnly ||
      f.sameDayDelivery ||
      f.availableToOrder ||
      (f.selectedBrands && f.selectedBrands.length > 0)
    );
  }

  // Returns a class for stock status
  getStockStatusClass(stock: number): string {
    if (stock === 0) return 'out-of-stock stock-indicator';
    if (stock <= 5) return 'low-stock stock-indicator';
    return 'in-stock stock-indicator';
  }

  // Returns a FontAwesome icon class for stock status
  getStockIcon(stock: number): string {
    if (stock === 0) return 'fas fa-times-circle';
    if (stock <= 5) return 'fas fa-exclamation-triangle';
    return 'fas fa-check-circle';
  }

  // Returns a text for stock status
  getStockText(stock: number): string {
    if (stock === 0) return 'Out of stock';
    if (stock <= 5) return 'Low stock';
    return 'In stock';
  }

  // Returns an array of visible page numbers for pagination (centered, max 5)
  getVisiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
