import { Component, OnInit } from '@angular/core';
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
  products: Product[] = [];
  filter: ProductFilter = {};
  categories: string[] = ['Electronics', 'Clothing', 'Home', 'Books'];
  loading: boolean = false;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.searchProducts();
  }

  searchProducts() {
    this.loading = true;
    this.error = null;

    this.productService.getProducts(this.filter).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      },
    });
  }

  clearFilters() {
    this.filter = {};
    this.searchProducts();
  }
}
