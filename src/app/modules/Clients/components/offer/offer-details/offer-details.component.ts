import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OfferViewModel } from '../../../Models/OfferViewModel';
import { Product } from '../../../Models/Product.model';
import { OfferService } from '../../../Services/offer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class OfferDetailsComponent implements OnInit {
  offer: OfferViewModel | undefined;
  products: Product[] = [];
  loading = true;
  productsLoading = true;
  offerId!: number;

  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.offerId = +this.route.snapshot.paramMap.get('id')!;
    if (this.offerId) {
      this.loadOfferDetails();
      this.loadProductsByOffer();
    } else {
      this.toastr.error('Invalid offer ID.');
      this.router.navigate(['/client/offers']);
    }
  }

  loadOfferDetails(): void {
    this.loading = true;
    this.offerService.getOfferDetails(this.offerId).subscribe({
      next: (response: OfferViewModel) => {
        this.offer = response;
        this.loading = false;
      },
      error: (err: any) => {
        this.toastr.error('Failed to load offer details.');
        this.loading = false;
      }
    });
  }

  loadProductsByOffer(): void {
    this.offerService.getProductsByOfferId(this.offerId).subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.productsLoading = false;
      },
      error: (err: any) => {
        this.toastr.error('Failed to load products for this offer.');
        this.productsLoading = false;
      }
    });
  }

  calculateDiscountPercentage(oldPrice: number, newPrice: number): number {
    if (oldPrice === 0) return 0;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  }

  goBack(): void {
    this.router.navigate(['/client/offers']);
  }
} 