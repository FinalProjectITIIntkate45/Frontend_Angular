import { Component, isStandalone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OffersService } from '../../../Services/offers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-form',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
  standalone: false,
})


export class OfferFormComponent {
  offerForm: FormGroup;

  constructor(private fb: FormBuilder, private offersService: OffersService , private router : Router,)  {
    this.offerForm = this.fb.group({
      code: ['', Validators.required],
      discount: [0, [Validators.required, Validators.min(0)]],
      expiryDate: ['', Validators.required],
      
    });
  }
 onSubmit() {
  if (this.offerForm.valid) {
    const formValue = this.offerForm.value;

    const offerData = {
      Code: formValue.code,
      Discount: formValue.discount,
      ExpiryDate: new Date(formValue.expiryDate).toISOString() // ✅ تحويل التاريخ لصيغة صحيحة
    };

    this.offersService.createOffer(offerData).subscribe({
      next: (res) => {
        console.log('Offer created successfully:', res);
        alert('تم إنشاء العرض بنجاح');
        this.offerForm.reset();
        this.router.navigate(['/provider/showoffers']);
      },
      error: (err) => {
        console.error('Error creating offer:', err);
        alert('فشل في إنشاء العرض');
      }
    });
  }
}

}
