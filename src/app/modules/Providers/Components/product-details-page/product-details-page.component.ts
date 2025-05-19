import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details-page',
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.css'],
})
export class ProductDetailsPageComponent implements OnInit {
  product!: Product;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // ✅ أضفناها
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getById(+id).subscribe((p) => {
        this.product = p;
        this.isLoading = false;
      });
    }
  }

  deleteProduct(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          this.toastr.success('Product deleted successfully ✅');
          this.router.navigate(['/vendor/products']);
        },
        error: (err) => {
          console.error('Failed to delete product', err);
          this.toastr.error('Failed to delete product ❌');
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/provider/products']); // ✅ زر الرجوع
  }
}
