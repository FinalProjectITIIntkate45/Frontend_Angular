import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-product-details-page',
  standalone: false,
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.css'],
})
export class ProductDetailsPageComponent implements OnInit {
  [x: string]: any;
  product!: Product;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,

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



  goBack(): void {
    this.router.navigate(['/provider/products']);
  }
}
