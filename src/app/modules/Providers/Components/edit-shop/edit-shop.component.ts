import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../Services/Shop.service'; // عدّلي المسار حسب هيكليتك
import { ShopEditViewModel } from '../../Models/shop.model'; // عدّلي المسار
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/Auth.service';

@Component({
  selector: 'app-edit-shop',
  templateUrl: './edit-shop.component.html',
  styleUrls: ['./edit-shop.component.css'],
  standalone: false,
})
export class EditShopComponent implements OnInit {
  shopForm: FormGroup;
  errorMessage: string = '';
  shopId: number;

  constructor(
    private fb: FormBuilder,
    private shopService: ShopService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.shopId = +this.route.snapshot.paramMap.get('id')!;
    this.shopForm = this.fb.group({
      shopName: ['', Validators.required],
      description: ['', Validators.required],
      address: ['', Validators.required],
      contactDetails: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      postalCode: [''],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
      businessPhone: ['', Validators.required],
      businessEmail: ['', [Validators.required, Validators.email]],
      logo: [null],
      images: [null],
      shopTypeId: [0, Validators.required],
    });
  }

  ngOnInit() {
    this.loadShopDetails();
  }

  loadShopDetails() {
    this.shopService.getShopById(this.shopId).subscribe({
      next: (shop: ShopEditViewModel) =>
        this.shopForm.patchValue({
          shopName: shop.shopName,
          description: shop.description,
          address: shop.address,
          contactDetails: shop.contactDetails,
          city: shop.city,
          street: shop.street,
          postalCode: shop.postalCode,
          latitude: shop.latitude,
          longitude: shop.longitude,
          businessPhone: shop.businessPhone,
          businessEmail: shop.businessEmail,
          shopTypeId: shop.shopTypeId,
        }),
      error: (err) =>
        (this.errorMessage = `Failed to load shop details: ${err.message}`),
    });
  }

  onSubmit() {
    if (this.shopForm.valid) {
      const formValue = this.shopForm.value;
      const model: ShopEditViewModel = {
        id: this.shopId,
        shopName: formValue.shopName,
        description: formValue.description,
        address: formValue.address,
        contactDetails: formValue.contactDetails,
        city: formValue.city,
        street: formValue.street,
        postalCode: formValue.postalCode,
        latitude: formValue.latitude,
        longitude: formValue.longitude,
        businessPhone: formValue.businessPhone,
        businessEmail: formValue.businessEmail,
        logo: formValue.logo instanceof File ? formValue.logo : null,
        shopTypeId: formValue.shopTypeId,
        // providerId: this.authService.getUserId(),
      };

      const formData = new FormData();
      formData.append('id', model.id.toString());
      formData.append('shopName', model.shopName);
      formData.append('description', model.description);
      formData.append('address', model.address);
      formData.append('city', model.city);
      formData.append('street', model.street);
      formData.append('postalCode', model.postalCode || '');
      formData.append('latitude', model.latitude.toString());
      formData.append('longitude', model.longitude.toString());
      formData.append('businessPhone', model.businessPhone);
      formData.append('businessEmail', model.businessEmail);
      if (model.logo) formData.append('logoFile', model.logo);
      formData.append('shopTypeId', model.shopTypeId.toString());

      this.shopService.updateShop(formData).subscribe({
        next: (msg) => (this.errorMessage = msg),
        error: (err) =>
          (this.errorMessage = `Failed to update shop: ${err.message}`),
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
