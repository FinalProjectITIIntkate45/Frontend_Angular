import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../Services/Shop.service';
import { ShopEditViewModel } from '../../Models/shop.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/Auth.service';

@Component({
  selector: 'app-edit-shop',
  templateUrl: './edit-shop.component.html',
  styleUrls: ['./edit-shop.component.css']
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
    this.shopForm = this.fb.group({
      shopName: ['', Validators.required],
      description: ['', Validators.required],
      address: ['', Validators.required],
      contactDetails: ['', Validators.required],
      logo: [null]
    });
    this.shopId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.loadShopDetails();
  }

  loadShopDetails() {
    this.shopService.getShopById(this.shopId).subscribe({
      next: (shop: { [key: string]: any; }) => this.shopForm.patchValue(shop),
      error: (_err: any) => this.errorMessage = 'Failed to load shop details'
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
        logo: formValue.logo,
        providerId: this.authService['getUserId']() 
      };

      this.shopService.updateShop(model).subscribe({
        next: (msg: string) => this.errorMessage = msg,
        error: (err: any) => this.errorMessage = 'Failed to update shop'
      });
    } else {
      this.errorMessage = 'Please fill all required fields';
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.shopForm.patchValue({ logo: file });
  }
}
