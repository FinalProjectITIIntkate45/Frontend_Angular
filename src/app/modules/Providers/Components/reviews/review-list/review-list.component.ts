import { Component, Input } from '@angular/core';
import { ReviewView } from '../../../models/ReviewView.Models';
import { GeneralreviewsService } from '../../../services/generalreviews.service';

@Component({
  selector: 'app-review-list',
  imports: [],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css',
})
export class ReviewListComponent {
  @Input() productId!: number;
  reviews: ReviewView[] = [];

  constructor(private reviewService: GeneralreviewsService) {}

  ngOnInit(): void {
    if (this.productId) {
      this.reviewService.getReviewsByProduct(this.productId).subscribe({
        next: (res) => (this.reviews = res),
        error: (err) => console.error(err),
      });
    }
  }
}
