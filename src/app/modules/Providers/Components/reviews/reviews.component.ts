import { Component, OnInit } from '@angular/core';
import { ReviewsService } from '../../Services/reviews.service';
import { Review } from '../../Models/review.model';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
  standalone: false,
})
export class ReviewsComponent implements OnInit {
  vendorReviews: Review[] = [];
  allReviews: Review[] = [];

  constructor(private reviewsService: ReviewsService) {}

  ngOnInit(): void {
    this.loadVendorReviews();
    this.loadAllReviews();
  }

  loadVendorReviews() {
    this.reviewsService.getVendorReviews().subscribe((reviews) => {
      this.vendorReviews = reviews;
    });
  }

  loadAllReviews() {
    this.reviewsService.getAllReviews().subscribe((reviews) => {
      this.allReviews = reviews;
    });
  }
}
