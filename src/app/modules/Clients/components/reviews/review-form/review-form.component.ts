import { OrderService } from './../../../../../core/services/order.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() productId!: number; // ✅ أضف دي
  @Output() reviewSubmitted = new EventEmitter<ReviewView>();

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
        this.existingReview?.rating || null,
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
      productId: this.productId, // ✅ مهم
      comments: formValue.comments,
      rating: formValue.rating,
      modificationDateTime: new Date().toISOString(), // ✅ قيمة صالحة
    };

    console.log('Review Data:', reviewData);

    if (this.isEdit && this.existingReview) {
      this.reviewService
        .updateReview(this.existingReview.id, reviewData)
        .subscribe({
          next: (updatedReview) => {
            this.reviewSubmitted.emit(updatedReview); // 💥
            alert('Review updated!');
          },
          error: (err) => {
            console.error('❌ Review Submit Error:', err);
            console.log('🔍 Backend Validation Errors:', err.error?.errors);
          },
        });
    } else {
      this.reviewService.createReview(reviewData).subscribe({
        next: (newReview) => {
          this.reviewSubmitted.emit(newReview); // 💥
          alert('Review submitted!');
        },
        error: (err) => {
          console.error('❌ Review Submit Error:', err);
          console.log('🔍 Backend Validation Errors:', err.error?.errors);
        },
      });
    }
  }

  setRating(value: number): void {
    this.reviewForm.patchValue({ rating: value });
    this.reviewForm.get('rating')?.markAsTouched();
  }
}
