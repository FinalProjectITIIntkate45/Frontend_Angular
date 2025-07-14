import { Component, OnInit, Inject } from '@angular/core';
import { OfferService } from '../../../Services/OfferServices.service';
import { PaginationResponse } from '../../../Models/PaginationResponse';
import { OfferViewModel } from '../../../Models/OfferViewModel';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shop-offers',
  templateUrl: './shopoffers.component.html',
  styleUrls: ['./shopoffers.component.css'],
  standalone: false,
})
export class ShopOffersComponent implements OnInit {
  offers: OfferViewModel[] = [];
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  loading = true;

  constructor(
    @Inject(OfferService) private offerService: OfferService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.loading = true;
    this.offerService.getShopOffers(this.pageSize, this.pageNumber).subscribe({
      next: (res: PaginationResponse<OfferViewModel>) => {
        this.offers = res.data;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalCount;
        this.pageNumber = res.pageNumber;
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Error loading offers:', error);
        this.toastr.error('حدث خطأ أثناء تحميل العروض', 'خطأ');
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadOffers();
      window.scrollTo(0, 0);
    }
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadOffers();
      window.scrollTo(0, 0);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.pageNumber) {
      this.pageNumber = page;
      this.loadOffers();
      window.scrollTo(0, 0);
    }
  }

  editOffer(offer: OfferViewModel): void {
    this.router.navigate(['/provider/edit-offer', offer.Id]);
  }

  editOfferProducts(offer: OfferViewModel): void {
    this.router.navigate(['/provider/offer-product-manager', offer.Id]);
  }

  deleteOffer(offer: OfferViewModel): void {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا العرض؟')) {
      this.offerService.deleteOffer(Number(offer.Id)).subscribe({
        next: () => {
          this.toastr.success('تم حذف العرض بنجاح', 'نجاح');
          // Reload offers or remove from current list
          if (this.offers.length === 1 && this.pageNumber > 1) {
            this.pageNumber--;
          }
          this.loadOffers();
        },
        error: (error: Error) => {
          console.error('Error deleting offer:', error);
          this.toastr.error('حدث خطأ أثناء حذف العرض', 'خطأ');
        }
      });
    }
  }

  getStatusBadgeClass(status: number): string {
    switch(status) {
      case 0: return 'bg-warning text-dark'; // Pending
      case 1: return 'bg-success text-white'; // Active
      case 2: return 'bg-danger text-white'; // Expired
      default: return 'bg-secondary text-white';
    }
  }

  getStatusText(status: number): string {
    switch(status) {
      case 0: return 'Pending';
      case 1: return 'Active';
      case 2: return 'Expired';
      default: return 'Unknown';
    }
  }

  generatePages(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, index) => index + 1);
  }

  getToIndex(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalRecords);
  }
}