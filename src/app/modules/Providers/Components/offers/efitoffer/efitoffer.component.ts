import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OffersService } from '../../../Services/offers.service';
import { Offer } from '../../../Models/offer';

@Component({
  selector: 'app-efitoffer',
  templateUrl: './efitoffer.component.html',
  styleUrls: ['./efitoffer.component.css'],
  standalone: false,
})
export class EfitofferComponent implements OnInit {
  offerForm: FormGroup;
  offerId: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private offersService: OffersService,
  ) {
    this.offerForm = this.fb.group({
      code: ['', Validators.required],
      discount: [0, [Validators.required, Validators.min(0)]],
      expiryDate: ['', Validators.required]
    });

    this.offerId = 0;
  }

ngOnInit(): void {
  this.offerId = +this.route.snapshot.paramMap.get('id')!; // ✅ المهم

  this.offersService.getOffer(this.offerId).subscribe({
    next: (data: Offer) => {
      this.offerForm.patchValue({
        code: data.Code,
        discount: data.Discount,
        expiryDate: data.ExpiryDate?.split('T')[0]
      });
    },
    error: (err: Error) => {
      console.error('Error loading offer', err);
    }
  });
}



  onSubmit(): void {
  if (this.offerForm.valid) {
    const formValue = this.offerForm.value;

    const updatedOffer: Offer = {
      Code: formValue.code,
      Discount: formValue.discount,
      ExpiryDate: new Date(formValue.expiryDate).toISOString()  // ✔️
    };

    this.offersService.update(this.offerId, updatedOffer).subscribe({
      next: () => {
        alert('تم تعديل العرض بنجاح');
        this.router.navigate(['/provider/showoffers']);
      },
      error: (err: Error) => {
        console.error('Error updating offer', err);
        alert('فشل في تعديل العرض');
      }
    });
  }
}

cancelEdit(): void {
  this.router.navigate(['/provider/showoffers']);
}

}