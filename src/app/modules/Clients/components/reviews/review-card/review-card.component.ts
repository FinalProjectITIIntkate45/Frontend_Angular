import { Component, Input } from '@angular/core';
import { ReviewView } from '../../../../../core/models/ReviewView.Models';

@Component({
  selector: 'app-review-card',
  standalone: false,
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css',
})
export class ReviewCardComponent {
  @Input() review!: ReviewView;
}
