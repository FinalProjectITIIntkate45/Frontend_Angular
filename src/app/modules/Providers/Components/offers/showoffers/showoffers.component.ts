import { Component, OnInit } from '@angular/core';
import { OffersService } from '../../../Services/offers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-showoffers',
  templateUrl: './showoffers.component.html',
  styleUrls: ['./showoffers.component.css'],
  standalone : false
})
export class ShowoffersComponent implements OnInit {
  offers: any[] = [];

  constructor(private offerService: OffersService, private router: Router) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers() {
    this.offerService.getOffers().subscribe({
      next: (data) => {
        this.offers = data;
      },
      error: (err) => {
        console.error('Error fetching offers', err);
      }
    });
  }

  editOffer(id: number) {
this.router.navigate(['/provider/editoffer', id]);
  }

  deleteOffer(id: number) {
    if (confirm('هل أنت متأكد من حذف هذا العرض؟')) {
      this.offerService.deleteOffer(id).subscribe({
        next: () => {
          this.offers = this.offers.filter((o: any) => o.Id !== id);
          alert('تم الحذف بنجاح');
        },
        error: (err) => {
          console.error('خطأ في الحذف:', err);
          alert('فشل في الحذف');
        }
      });
    }
  }

}