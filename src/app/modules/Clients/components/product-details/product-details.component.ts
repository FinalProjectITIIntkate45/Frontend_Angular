import { WishlistItem } from './../../Models/wishlist.model';
import { WishlistService } from './../../Services/wishlist.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { Product } from '../../Models/Product.model';

import { Subscription } from 'rxjs';

// Enhanced Product interface with additional display properties
interface EnhancedProduct extends Product {
  rating: number;
  ratingCount: number;
  discountPercentage: number;
  isNew: boolean;
  formattedPrice?: string;
  formattedOriginalPrice?: string;
}

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
  loadingRelated: boolean = false;

  // UI state
  isAddingToCart: boolean = false;
  isAddingToWishlist: boolean = false;

  private routeSubscription?: Subscription;

  // Math reference for template
  Math = Math;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
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

        // Load related products
        this.loadRelatedProducts();
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
    this.isAddingToCart = false;
    this.isAddingToWishlist = false;
  }

  private enhanceProduct(product: Product): EnhancedProduct {
    const enhanced: EnhancedProduct = {
      ...product,
      rating: this.generateRandomRating(),
      ratingCount: this.generateRandomRatingCount(),
      discountPercentage: this.calculateDiscountPercentage(product),
      isNew: this.isNewProduct(product),
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

    // Search for products in the same category
    this.productService
      .searchProducts({
        category: this.product.CategoryName,
        pageNumber: 1,
        pageSize: 6, // Increased to get more options
      })
      .subscribe({
        next: (result) => {
          // Filter out current product and enhance the results
          this.relatedProducts = (result.Products || [])
            .filter((p) => p.Id !== this.product?.Id)
            .slice(0, 3)
            .map((p) => this.enhanceProduct(p));
          this.loadingRelated = false;
        },
        error: (error) => {
          console.error('Error loading related products:', error);
          this.relatedProducts = [];
          this.loadingRelated = false;
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
  async addToCart() {
    if (!this.product || this.product.Stock === 0 || this.isAddingToCart) {
      return;
    }

    this.isAddingToCart = true;

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('Adding to cart:', {
        productId: this.product.Id,
        productName: this.product.Name,
        quantity: this.quantity,
        price:
          this.product.DisplayedPriceAfterDiscount ||
          this.product.DisplayedPrice,
        totalPrice:
          (this.product.DisplayedPriceAfterDiscount ||
            this.product.DisplayedPrice) * this.quantity,
      });

      // TODO: Implement actual cart service logic here
      // await this.cartService.addToCart(this.product, this.quantity);

      // Show success message
      this.showSuccessMessage(
        `Added ${this.quantity} ${this.product.Name}(s) to cart!`
      );

      // Reset quantity after successful add
      this.quantity = 1;
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.showErrorMessage('Failed to add item to cart. Please try again.');
    } finally {
      this.isAddingToCart = false;
    }
  }

  async addToWishlist() {
    if (!this.product || this.isAddingToWishlist) return;

    this.isAddingToWishlist = true;

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log('Adding to wishlist:', {
        productId: this.product.Id,
        productName: this.product.Name,
      });

      // TODO: Implement actual wishlist service logic here
      // await this.wishlistService.addToWishlist(this.product);

      this.showSuccessMessage(`${this.product.Name} added to wishlist!`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      this.showErrorMessage(
        'Failed to add item to wishlist. Please try again.'
      );
    } finally {
      this.isAddingToWishlist = false;
    }
  }

  // Navigation methods with error handling
  viewRelatedProduct(productId: number) {
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
