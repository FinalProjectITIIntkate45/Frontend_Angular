import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { VendorService } from '../../Services/vendor.service';
import { EditVendorProfile } from '../../Models/edit-vendor-profile.model';


@Component({
  selector: 'app-edit-vendor-profile',
  templateUrl: './editvendorprofile.component.html',
  styleUrls: ['./editvendorprofile.component.css'],
  standalone: false,
})


export class EditVendorProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private profileService: VendorService) {
    this.profileForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      profileImg: [''],
      nationalID: [''],

      shopName: ['', Validators.required],
      shopDescription: [''],
      shopAddress: [''],
      city: [''],
      street: [''],
      postalCode: [''],
      businessPhone: [''],
      businessEmail: [''],
      shopLogo: [''],
      latitude: [''],
      longitude: [''],

      shippingOptions: this.fb.array([])
    });
  }

  ngOnInit() {
    this.profileService.getVendorProfile().subscribe((data) => {
    console.log("بيانات البروفايل:", data); 
      this.profileForm.patchValue(data);
      data.shippingOptions.forEach((option: any) => {
        this.shippingOptions.push(this.fb.group({
          orderId: [option.orderId],
          address: [option.address],
          status: [option.status]
        }));
      });
    });
  }

  get shippingOptions(): FormArray {
    return this.profileForm.get('shippingOptions') as FormArray;
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const model: EditVendorProfile = this.profileForm.value;
      this.profileService.updateVendorProfile(model).subscribe({
        next: () => alert('تم التحديث بنجاح ✅'),
        error: (err: any) => console.error(err)
      });
    }
  }
}
