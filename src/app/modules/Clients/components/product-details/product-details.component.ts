import { WishlistItem } from './../../Models/wishlist.model';
import { WishlistService } from './../../Services/wishlist.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { Product } from '../../Models/Product.model';

import { Subscription } from 'rxjs';
import { CartServicesService } from '../../Services/CardServices.service';

// Enhanced Product interface with additional display properties
interface EnhancedProduct extends Product {
  rating: number;
  ratingCount: number;
  discountPercentage: number;
  isNew: boolean;
  formattedPrice?: string;
  formattedOriginalPrice?: string;
  IsBestSeller?: boolean; // Add this property
}
// When a product loads, all 4 suggestion types are fetched simultaneously
// Related Products: Same category, sorted by price similarity
// Similar Products: Different categories, similar price range (±30%)
// Popular Products: High points products, sorted by points
// New Arrivals: Products created in last 30 days, sorted by date
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  standalone: false,
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: EnhancedProduct | null = null;
  loading: boolean = false;
  error: string | null = null;
  selectedImage: string | null = null;
  quantity: number = 1;

  // Related/suggested products
  relatedProducts: EnhancedProduct[] = [];
  similarProducts: EnhancedProduct[] = [];
  popularProducts: EnhancedProduct[] = [];
  newArrivals: EnhancedProduct[] = [];
  loadingRelated: boolean = false;
  loadingSimilar: boolean = false;
  loadingPopular: boolean = false;
  loadingNewArrivals: boolean = false;

  // UI state
  isAddingToCart: boolean = false;
  isAddingToWishlist: boolean = false;
  isInWishlist: boolean = false; // Track wishlist state

  private routeSubscription?: Subscription;

  // Math reference for template
  Math = Math;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cardsercive: CartServicesService,
    private WishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (id) {
        this.loadProduct(id);
        // Scroll to top when navigating to new product
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  public loadProduct(id: number) {
    this.loading = true;
    this.error = null;
    this.resetState();

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = this.enhanceProduct(product);
        this.selectedImage = this.product.Images?.[0] || null;
        this.loading = false;
        this.checkIfInWishlist();
        // Load all types of product suggestions
        this.loadRelatedProducts();
        this.loadSimilarProducts();
        this.loadPopularProducts();
        this.loadNewArrivals();
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error =
          error.error?.message ||
          'Failed to load product details. Please try again.';
        this.loading = false;
      },
    });
  }

  private resetState() {
    this.quantity = 1;
    this.selectedImage = null;
    this.relatedProducts = [];
    this.similarProducts = [];
    this.popularProducts = [];
    this.newArrivals = [];
    this.isAddingToCart = false;
    this.isAddingToWishlist = false;
  }

  private checkIfInWishlist() {
    if (!this.product) return;
    this.WishlistService.getWishlist(1, 100).subscribe({
      next: (items) => {
        this.isInWishlist = items.some(
          (item) => item.ProductId === this.product!.Id
        );
      },
      error: () => {
        this.isInWishlist = false;
      },
    });
  }

  private enhanceProduct(product: Product): EnhancedProduct {
    const enhanced: EnhancedProduct = {
      ...product,
      rating: this.generateRandomRating(),
      ratingCount: this.generateRandomRatingCount(),
      discountPercentage: this.calculateDiscountPercentage(product),
      isNew: this.isNewProduct(product),
      IsBestSeller: (product as any).IsBestSeller ?? false, // Defensive, in case not present
    };

    // Pre-format prices for better performance
    enhanced.formattedPrice = this.formatPrice(
      enhanced.DisplayedPriceAfterDiscount || enhanced.DisplayedPrice
    );
    enhanced.formattedOriginalPrice = this.formatPrice(enhanced.DisplayedPrice);

    return enhanced;
  }

  private loadRelatedProducts() {
    if (!this.product) return;

    this.loadingRelated = true;

    // Search for products in the same category with better filtering
    this.productService
      .searchProducts({
        category: this.product.CategoryName,
        minPrice: null,
        maxPrice: null,
        minPoints: null,
        maxPoints: null,
        pageNumber: 1,
        pageSize: 8, // Get more options for better filtering
      })
      .subscribe({
        next: (result) => {
          // Filter out current product and enhance the results
          const filteredProducts = (result.Products || [])
            .filter((p) => p.Id !== this.product?.Id)
            .map((p) => this.enhanceProduct(p));

          // Sort by relevance (same category, similar price range)
          const sortedProducts = filteredProducts.sort((a, b) => {
            const priceDiffA = Math.abs(
              a.DisplayedPrice - this.product!.DisplayedPrice
            );
            const priceDiffB = Math.abs(
              b.DisplayedPrice - this.product!.DisplayedPrice
            );
            return priceDiffA - priceDiffB; // Sort by price similarity
          });

          this.relatedProducts = sortedProducts.slice(0, 4);
          this.loadingRelated = false;
        },
        error: (error) => {
          console.error('Error loading related products:', error);
          this.relatedProducts = [];
          this.loadingRelated = false;
        },
      });
  }

  private loadSimilarProducts() {
    if (!this.product) return;

    this.loadingSimilar = true;

    // Search for products in different categories but similar price range
    const priceRange = this.product.DisplayedPrice * 0.3; // 30% price range
    const minPrice = this.product.DisplayedPrice - priceRange;
    const maxPrice = this.product.DisplayedPrice + priceRange;

    this.productService
      .searchProducts({
        minPrice: Math.max(0, minPrice),
        maxPrice: maxPrice,
        minPoints: null,
        maxPoints: null,
        pageNumber: 1,
        pageSize: 12, // Get more options for better filtering
      })
      .subscribe({
        next: (result) => {
          // Filter out current product and products from same category
          const filteredProducts = (result.Products || [])
            .filter(
              (p) =>
                p.Id !== this.product?.Id &&
                p.CategoryName !== this.product?.CategoryName
            )
            .map((p) => this.enhanceProduct(p));

          // Sort by price similarity
          const sortedProducts = filteredProducts.sort((a, b) => {
            const priceDiffA = Math.abs(
              a.DisplayedPrice - this.product!.DisplayedPrice
            );
            const priceDiffB = Math.abs(
              b.DisplayedPrice - this.product!.DisplayedPrice
            );
            return priceDiffA - priceDiffB;
          });

          this.similarProducts = sortedProducts.slice(0, 4);
          this.loadingSimilar = false;
        },
        error: (error) => {
          console.error('Error loading similar products:', error);
          this.similarProducts = [];
          this.loadingSimilar = false;
        },
      });
  }

  private loadPopularProducts() {
    if (!this.product) return;

    this.loadingPopular = true;

    // Search for popular products (high points, good ratings)
    this.productService
      .searchProducts({
        minPrice: null,
        maxPrice: null,
        minPoints: 50, // Products with good points
        maxPoints: null,
        pageNumber: 1,
        pageSize: 12,
      })
      .subscribe({
        next: (result) => {
          // Filter out current product and enhance the results
          const filteredProducts = (result.Products || [])
            .filter((p) => p.Id !== this.product?.Id)
            .map((p) => this.enhanceProduct(p));

          // Sort by points (popularity indicator)
          const sortedProducts = filteredProducts.sort((a, b) => {
            return (b.Points || 0) - (a.Points || 0);
          });

          this.popularProducts = sortedProducts.slice(0, 4);
          this.loadingPopular = false;
        },
        error: (error) => {
          console.error('Error loading popular products:', error);
          this.popularProducts = [];
          this.loadingPopular = false;
        },
      });
  }

  private loadNewArrivals() {
    if (!this.product) return;

    this.loadingNewArrivals = true;

    // Search for new arrivals (recently created products)
    this.productService
      .searchProducts({
        minPrice: null,
        maxPrice: null,
        minPoints: null,
        maxPoints: null,
        pageNumber: 1,
        pageSize: 12,
      })
      .subscribe({
        next: (result) => {
          // Filter out current product and enhance the results
          const filteredProducts = (result.Products || [])
            .filter((p) => p.Id !== this.product?.Id)
            .map((p) => this.enhanceProduct(p));

          // Sort by creation date (newest first)
          const sortedProducts = filteredProducts.sort((a, b) => {
            const dateA = new Date(a.CreatedAt || 0);
            const dateB = new Date(b.CreatedAt || 0);
            return dateB.getTime() - dateA.getTime();
          });

          // Filter to only show products created in the last 30 days
          const recentProducts = sortedProducts.filter((p) => {
            if (!p.CreatedAt) return false;
            const createdDate = new Date(p.CreatedAt);
            const now = new Date();
            const diffInDays =
              (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
            return diffInDays <= 30;
          });

          this.newArrivals = recentProducts.slice(0, 4);
          this.loadingNewArrivals = false;
        },
        error: (error) => {
          console.error('Error loading new arrivals:', error);
          this.newArrivals = [];
          this.loadingNewArrivals = false;
        },
      });
  }

  // Enhanced helper methods for product enhancements
  private generateRandomRating(): number {
    // Generate ratings between 3.5 and 5.0 for more realistic results
    return Math.random() * 1.5 + 3.5;
  }

  private generateRandomRatingCount(): number {
    // Generate more realistic review counts
    return Math.floor(Math.random() * 800) + 50;
  }

  private calculateDiscountPercentage(product: Product): number {
    if (
      !product.DisplayedPriceAfterDiscount ||
      product.DisplayedPriceAfterDiscount >= product.DisplayedPrice
    ) {
      return 0;
    }
    const discount =
      product.DisplayedPrice - product.DisplayedPriceAfterDiscount;
    return Math.round((discount / product.DisplayedPrice) * 100);
  }

  private isNewProduct(product: Product): boolean {
    if (!product.CreatedAt) return false;
    const createdDate = new Date(product.CreatedAt);
    const now = new Date();
    const diffInDays =
      (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
    return diffInDays <= 30;
  }

  // Image gallery methods
  selectImage(image: string) {
    this.selectedImage = image;
  }

  // Enhanced quantity methods with validation
  increaseQuantity() {
    if (this.product && this.quantity < this.product.Stock) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  setQuantity(newQuantity: number) {
    if (this.product && newQuantity >= 1 && newQuantity <= this.product.Stock) {
      this.quantity = newQuantity;
    }
  }

  // Enhanced action methods with loading states
  // Helper to add or update product in cart
  private addOrUpdateCartItem(redirectToCheckout: boolean = false) {
    if (!this.product || this.product.Stock === 0 || this.isAddingToCart) {
      return;
    }
    this.isAddingToCart = true;
    this.cardsercive.getCartItems().subscribe({
      next: (cart) => {
        // Ensure all IDs are numbers for comparison
        const productId = Number(this.product!.Id);
        const existingItem = cart.Items?.find(
          (item) => Number(item.productVM?.Id) === productId
        );
        if (existingItem && existingItem.cartItemId != null) {
          // Update quantity (try update first)
          const newQty = (existingItem.qty ?? 1) + this.quantity;
          this.cardsercive
            .updateCartItemQuantity(existingItem.cartItemId as number, newQty)
            .subscribe(
              () => {
                this.cardsercive.refreshCartItemsCount();
                this.showSuccessMessage(
                  `Updated quantity for ${this.product!.Name} in cart!` +
                    (redirectToCheckout ? ' Redirecting to checkout...' : '')
                );
                this.quantity = 1;
                if (redirectToCheckout) {
                  this.router.navigate(['/client/checkout']);
                }
                this.isAddingToCart = false;
              },
              (error) => {
                // If update fails (e.g., backend does not merge), remove and add
                if (existingItem.cartItemId != null) {
                  this.cardsercive
                    .removeFromCart(existingItem.cartItemId as number)
                    .subscribe({
                      next: () => {
                        this.cardsercive
                          .addToCart(
                            this.product!.Id,
                            newQty,
                            this.product!.DisplayedPriceAfterDiscount ||
                              this.product!.DisplayedPrice,
                            this.product!.Points
                          )
                          .subscribe(
                            () => {
                              this.cardsercive.refreshCartItemsCount();
                              this.showSuccessMessage(
                                `Added ${newQty} ${
                                  this.product!.Name
                                }(s) to cart!` +
                                  (redirectToCheckout
                                    ? ' Redirecting to checkout...'
                                    : '')
                              );
                              this.quantity = 1;
                              if (redirectToCheckout) {
                                this.router.navigate(['/client/checkout']);
                              }
                              this.isAddingToCart = false;
                            },
                            (addError) => {
                              this.showErrorMessage(
                                'Failed to add item to cart.'
                              );
                              this.isAddingToCart = false;
                            }
                          );
                      },
                      error: () => {
                        this.showErrorMessage(
                          'Failed to update or replace cart item.'
                        );
                        this.isAddingToCart = false;
                      },
                    });
                } else {
                  this.showErrorMessage(
                    'Cart item ID is missing. Cannot update or remove cart item.'
                  );
                  this.isAddingToCart = false;
                }
              }
            );
        } else if (!existingItem) {
          // Add new item
          this.cardsercive
            .addToCart(
              this.product!.Id,
              this.quantity,
              this.product!.DisplayedPriceAfterDiscount ||
                this.product!.DisplayedPrice,
              this.product!.Points
            )
            .subscribe(
              () => {
                this.cardsercive.refreshCartItemsCount();
                this.showSuccessMessage(
                  `Added ${this.quantity} ${this.product!.Name}(s) to cart!` +
                    (redirectToCheckout ? ' Redirecting to checkout...' : '')
                );
                this.quantity = 1;
                if (redirectToCheckout) {
                  this.router.navigate(['/client/checkout']);
                }
                this.isAddingToCart = false;
              },
              (error) => {
                this.showErrorMessage('Failed to add item to cart.');
                this.isAddingToCart = false;
              }
            );
        } else {
          // Defensive: if cartItemId is undefined, show error
          this.showErrorMessage('Cart item ID is missing. Cannot update cart.');
          this.isAddingToCart = false;
        }
      },
      error: () => {
        this.showErrorMessage('Failed to fetch cart items.');
        this.isAddingToCart = false;
      },
    });
  }

  addToCart() {
    this.addOrUpdateCartItem(false);
  }

  buyNow() {
    this.addOrUpdateCartItem(true);
  }

  toggleWishlist() {
    if (!this.product || this.isAddingToWishlist) return;
    this.isAddingToWishlist = true;
    if (this.isInWishlist) {
      this.WishlistService.deleteProduct(this.product.Id).subscribe({
        next: () => {
          this.isInWishlist = false;
          this.WishlistService.refreshWishlistCount();
          this.showSuccessMessage(
            `${this.product?.Name} removed from wishlist!`
          );
        },
        error: () => {
          this.showErrorMessage(
            'Failed to remove item from wishlist. Please try again.'
          );
        },
        complete: () => {
          this.isAddingToWishlist = false;
        },
      });
    } else {
      this.WishlistService.addToWishlist(this.product.Id).subscribe({
        next: (value) => {
          this.isInWishlist = true;
          this.WishlistService.refreshWishlistCount();
          this.showSuccessMessage(`${this.product?.Name} added to wishlist!`);
        },
        error: (err) => {
          const msg = err?.error;
          if (
            typeof msg === 'string' &&
            msg.toLowerCase().includes('already exist')
          ) {
            this.isInWishlist = true;
            this.WishlistService.refreshWishlistCount();
            this.showSuccessMessage('Already in wishlist!');
          } else {
            this.showErrorMessage(
              'Failed to add item to wishlist. Please try again.'
            );
          }
        },
        complete: () => {
          this.isAddingToWishlist = false;
        },
      });
    }
  }

  // Navigation methods with error handling
  viewRelatedProduct(productId: number) {
    if (productId) {
      this.router.navigate(['/client/products', productId]);
    }
  }

  viewSimilarProduct(productId: number) {
    if (productId) {
      this.router.navigate(['/client/products', productId]);
    }
  }

  viewPopularProduct(productId: number) {
    if (productId) {
      this.router.navigate(['/client/products', productId]);
    }
  }

  viewNewArrivalProduct(productId: number) {
    if (productId) {
      this.router.navigate(['/client/products', productId]);
    }
  }

  goToCategory(categoryName: string) {
    if (categoryName) {
      this.router.navigate(['/client/products'], {
        queryParams: { category: categoryName },
      });
    }
  }

  goToShop(shopName: string) {
    if (shopName) {
      this.router.navigate(['/client/products'], {
        queryParams: { shop: shopName },
      });
    }
  }

  // Enhanced template helper methods
  getRatingStars(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, index) => index < Math.floor(rating));
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  // Enhanced share functionality
  async shareProduct() {
    if (!this.product) return;

    const shareData = {
      title: this.product.Name,
      text: `Check out ${
        this.product.Name
      } - ${this.product.Description?.substring(0, 100)}...`,
      url: window.location.href,
    };

    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        this.showSuccessMessage('Product link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing product:', error);
      // Final fallback
      try {
        await navigator.clipboard.writeText(window.location.href);
        this.showSuccessMessage('Product link copied to clipboard!');
      } catch (clipboardError) {
        this.showErrorMessage(
          'Unable to share product. Please copy the URL manually.'
        );
      }
    }
  }

  // Utility methods for user feedback
  private showSuccessMessage(message: string) {
    // TODO: Replace with proper toast/notification service
    alert(message);
  }

  private showErrorMessage(message: string) {
    // TODO: Replace with proper toast/notification service
    alert(message);
  }

  // Additional utility methods
  getStockStatusClass(): string {
    if (!this.product) return '';

    if (this.product.Stock === 0) return 'out-of-stock';
    if (this.product.Stock <= 5) return 'low-stock';
    return 'in-stock';
  }

  isDiscounted(): boolean {
    return !!this.product && (this.product.discountPercentage ?? 0) > 0;
  }

  getTotalPrice(): number {
    if (!this.product) return 0;
    return (
      (this.product.DisplayedPriceAfterDiscount ||
        this.product.DisplayedPrice) * this.quantity
    );
  }

  canAddToCart(): boolean {
    return !!(this.product && this.product.Stock > 0 && !this.isAddingToCart);
  }

  // Image preloading for better UX
  preloadImages() {
    if (!this.product?.Images) return;

    this.product.Images.forEach((imageUrl) => {
      const img = new Image();
      img.src = imageUrl;
    });
  }
}
