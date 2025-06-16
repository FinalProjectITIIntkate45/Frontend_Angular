// import { Component, OnInit } from '@angular/core';
// import { ShopService } from '../../Services/Shop.service';
// //import { ShopCreateModel } from '../../Models/shop.model';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../../../../core/services/Auth.service';

// @Component({
//   selector: 'app-add-shop',
//   templateUrl: './add-shop.component.html',
//   styleUrls: ['./add-shop.component.css'],
//   standalone: false,
// })
// export class AddShopComponent implements OnInit {
//   shopForm: FormGroup;
//   errorMessage: string = '';

//   constructor(
//     private fb: FormBuilder,
//     private shopService: ShopService,
//     private authService: AuthService
//   ) {
//     this.shopForm = this.fb.group({
//       shopName: ['', Validators.required],
//       description: ['', Validators.required],
//       address: ['', Validators.required],
//       city: ['', Validators.required],
//       street: ['', Validators.required],
//       postalCode: [''],
//       latitude: [0, Validators.required],
//       longitude: [0, Validators.required],
//       businessPhone: ['', Validators.required],
//       businessEmail: ['', [Validators.required, Validators.email]],
//       logo: [null],
//       images: [null],
//       shopTypeId: [0, Validators.required],
//     });
//   }

//   ngOnInit() {}

//   onSubmit() {
//     if (this.shopForm.valid) {
//       const formValue = this.shopForm.value;
//       const model: ShopCreateModel = {
//         shopName: formValue.shopName,
//         description: formValue.description,
//         address: formValue.address,
//         city: formValue.city,
//         street: formValue.street,
//         postalCode: formValue.postalCode,
//         latitude: formValue.latitude,
//         longitude: formValue.longitude,
//         businessPhone: formValue.businessPhone,
//         businessEmail: formValue.businessEmail,
//         logo: formValue.logo,
//         images: formValue.images,
//         providerId: this.authService.getUserId(),
//         shopTypeId: formValue.shopTypeId,
//       };

//       this.shopService.addShop(model).subscribe({
//         next: (msg: string) => (this.errorMessage = msg),
//         error: (err: any) => (this.errorMessage = 'Failed to add shop'),
//       });
//     } else {
//       this.errorMessage = 'Please fill all required fields';
//     }
//   }

//   onFileChange(event: any, field: string) {
//     if (field === 'logo') {
//       const file = event.target.files[0];
//       this.shopForm.patchValue({ logo: file });
//     } else if (field === 'images') {
//       const files = Array.from(event.target.files) as File[];
//       this.shopForm.patchValue({ images: files });
//     }
//   }
// }
