import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OfferViewModel } from '../../../Models/OfferViewModel';
import { ProductDetailsViewModel } from '../../../Models/ProductDetailsViewModel';
import { OfferService } from '../../../Services/OfferServices.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-offer-detailes',
  templateUrl: './OfferDetailes.component.html',
  styleUrls: ['./OfferDetailes.component.css'],
  providers: [DatePipe],
  standalone : false
})
export class OfferDetailesComponent implements OnInit {
  offerId!: number;
  offer!: OfferViewModel;
  products: ProductDetailsViewModel[] = [];
  loading = true;
  productsLoading = true;
  currentDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.offerId = +this.route.snapshot.paramMap.get('id')!;
    this.loadOfferDetails();
    this.loadProductsByOffer();
  }

  loadOfferDetails(): void {
    this.offerService.getOfferDetails(this.offerId).subscribe({
      next: (offer: OfferViewModel) => {
        this.offer = offer;
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load offer details');
        this.loading = false;
      }
    });
  }

  loadProductsByOffer(): void {
    this.offerService.getProductsByOfferId(this.offerId).subscribe({
      next: (products: ProductDetailsViewModel[]) => {
        this.products = products;
        this.productsLoading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load products for this offer');
        this.productsLoading = false;
      }
    });
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'mediumDate') || '';
  }

  isOfferActive(): boolean {
    if (!this.offer) return false;
    const startDate = new Date(this.offer.StartDate);
    const endDate = new Date(this.offer.EndDate);
    return this.currentDate >= startDate && this.currentDate <= endDate;
  }

  calculateDiscountPercentage(oldPrice: number, newPrice: number): number {
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  }
}