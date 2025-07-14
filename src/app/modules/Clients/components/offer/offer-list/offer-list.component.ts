import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OfferViewModel } from '../../../Models/OfferViewModel';
import { OfferService } from '../../../Services/offer.service';
import { PaginationResponse } from '../../../Models/PaginationResponse';
import { CommonModule } from '@angular/common';
import { CartServicesService } from '../../../Services/CardServices.service';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class OfferListComponent implements OnInit {
  offers: OfferViewModel[] = [];
  loading = true;
  pageNumber = 1;
  pageSize = 9;
  totalPages = 0;
  totalRecords = 0;

  constructor(
    private offerService: OfferService,
    private router: Router,
    private toastr: ToastrService,
    private cartService: CartServicesService
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.loading = true;
    this.offerService.getAllOffers(this.pageSize, this.pageNumber).subscribe({
      next: (response: PaginationResponse<OfferViewModel>) => {
        this.offers = response.data || [];
        this.pageNumber = response.pageNumber;
        this.pageSize = response.pageSize;
        this.totalPages = response.totalPages;
        this.totalRecords = response.totalCount;
        this.loading = false;
      },
      error: (err: any) => {
        this.toastr.error('Failed to load offers.');
        this.loading = false;
      },
    });
  }

  viewDetails(offerId: number): void {
    this.router.navigate(['/offers', offerId]);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageNumber = page;
      this.loadOffers();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadOffers();
    }
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadOffers();
    }
  }

  get getFromIndex(): number {
    return (this.pageNumber - 1) * this.pageSize + 1;
  }

  get getToIndex(): number {
    const to = this.pageNumber * this.pageSize;
    return to > this.totalRecords ? this.totalRecords : to;
  }

  addOfferToCart(offer: OfferViewModel): void {
    if (!offer.Products || offer.Products.length === 0) {
      this.toastr.error('No products in this offer.');
      return;
    }
    const product = offer.Products[0];
    this.cartService
      .addOfferToCart(
        product.ProductId,
        product.ProductQuantity,
        offer.NewPrice,
        offer.NewPoints,
        offer.Id
      )
      .subscribe({
        next: () => this.toastr.success('Offer added to cart!'),
        error: () => this.toastr.error('Failed to add offer to cart.'),
      });
  }
}