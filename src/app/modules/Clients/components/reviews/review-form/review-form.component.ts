import { Component, Input, OnInit } from '@angular/core';
import { ReviewView } from '../../../../../core/models/ReviewView.Models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralreviewsService } from '../../../../../core/services/generalreviews.service';

@Component({
  selector: 'app-review-form',
  standalone: false,
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css',
})
export class ReviewFormComponent implements OnInit {
  @Input() orderId!: number;
  @Input() isEdit: boolean = false;
  @Input() existingReview?: ReviewView;

  reviewForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reviewService: GeneralreviewsService
  ) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      comments: [
        this.existingReview?.comments || '',
        [Validators.maxLength(500)],
      ],
      rating: [
        this.existingReview?.rating || 1,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
    });
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) return;

    const formValue = this.reviewForm.value;
    const reviewData: ReviewView = {
      id: this.existingReview?.id || 0,
      orderId: this.orderId,
      comments: formValue.comments,
      rating: formValue.rating,
      modificationDateTime: '', // will be ignored in backend
    };

    if (this.isEdit && this.existingReview) {
      this.reviewService
        .updateReview(this.existingReview.id, reviewData)
        .subscribe({
          next: () => alert('Review updated!'),
          error: (err) => console.error(err),
        });
    } else {
      this.reviewService.createReview(reviewData).subscribe({
        next: () => alert('Review submitted!'),
        error: (err) => console.error(err),
      });
    }
  }

  setRating(value: number): void {
    this.reviewForm.patchValue({ rating: value });
  }
}
