import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../Services/Shop.service';
import { ShopCreateModel } from '../../Models/shop.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/Auth.service';

@Component({
  selector: 'app-add-shop',
  templateUrl: './add-shop.component.html',
  styleUrls: ['./add-shop.component.css'],
  standalone: false,
})
export class AddShopComponent implements OnInit {
  shopForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private shopService: ShopService,
    private authService: AuthService
  ) {
    this.shopForm = this.fb.group({
      shopName: ['test', Validators.required],
      description: ['test', Validators.required],
      address: ['aswan', Validators.required],
      city: ['aswan', Validators.required],
      street: ['aswan', Validators.required],
      postalCode: ['2222'],
      latitude: [2.2, Validators.required],
      longitude: [1.5, Validators.required],
      businessPhone: ['1', Validators.required],
      businessEmail: ['test2', [Validators.required, Validators.email]],
      logo: [null],
      images: [null],
      shopTypeId: [0, Validators.required],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.shopForm.valid) {
      const formValue = this.shopForm.value;
      const formData = new FormData();
      formData.append('Name', formValue.shopName);
      formData.append('Description', formValue.description);
      formData.append('Address', formValue.address);
      formData.append('City', formValue.city);
      formData.append('Street', formValue.street);
      formData.append('PostalCode', formValue.postalCode || '');
      formData.append('Latitude', formValue.latitude.toString());
      formData.append('Longitude', formValue.longitude.toString());
      formData.append('BusinessPhone', formValue.businessPhone);
      formData.append('BusinessEmail', formValue.businessEmail);
      if (formValue.logo) formData.append('LogoFile', formValue.logo);
      if (formValue.images) {
        (formValue.images as File[]).forEach((file, index) => {
          formData.append(`ImagesFiles[${index}]`, file);
        });
      }
      // formData.append('providerId', this.authService.getUserId() || '');
      formData.append('TypeId', formValue.shopTypeId.toString());

      console.log('FormData:', Object.fromEntries(formData)); // للتحقق

      this.shopService.addShop(formData).subscribe({
        next: (msg: string) => (this.errorMessage = msg),
        error: (err: any) =>
          (this.errorMessage = `Failed to add shop: ${err.message}`),
      });
    } else {
      this.errorMessage = 'Please fill all required fields';
    }
  }

  onFileChange(event: any, field: string) {
    if (field === 'logo') {
      const file = event.target.files[0];
      this.shopForm.patchValue({ logo: file });
    } else if (field === 'images') {
      const files = Array.from(event.target.files) as File[];
      this.shopForm.patchValue({ images: files });
    }
  }
}
