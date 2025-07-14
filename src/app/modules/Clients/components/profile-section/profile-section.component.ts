import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from '../../../../modules/auth/services/account.service';
import { ProfileViewModel } from '../../../../modules/Clients/Models/profile-view.model';
import { ProfileView } from '../../../auth/models/profile-view.model';

@Component({
  selector: 'app-profile-section',
  standalone:false,
  templateUrl:'./profile-section.component.html',
  styleUrls: ['./profile-section.component.css'],
})
export class ProfileSectionComponent implements OnInit {
  personalInfoForm: FormGroup;
  contactInfoForm: FormGroup;
  passwordForm: FormGroup;
  profileImgPreview: string | ArrayBuffer | null = '';
  isDeleting: boolean = false;

  // Edit mode flags
  editPersonalInfo = false;
  editContactInfo = false;
  editPassword = false;

  // Store original values for cancel
  originalPersonalInfo: any;
  originalContactInfo: any;

  profileData: ProfileView | null = null;
  error: string | null = null;
  ordersCount: number = 3;
  recyclingPoints: number = 320;
  stats = {
    browsedItems: 1230,
    orders: 45,
    favorites: 89,
    reviews: 17,
  };
  rankProgress: number = 32;
  loyaltyProgress: number = 70;
  browsingHistory = [
    { name: "Men's Cotton T-Shirt", category: 'Clothing', icon: 'fas fa-tshirt' },
    { name: 'Smartphone Case', category: 'Electronics', icon: 'fas fa-mobile-alt' },
    { name: 'Kitchen Knife Set', category: 'Home & Kitchen', icon: 'fas fa-utensils' },
  ];

  clientProfileForm: FormGroup;
  editClientProfile = false;
  originalClientProfile: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private accountService: AccountService
  ) {
    this.personalInfoForm = this.fb.group({
      fullName: ['', Validators.required],
      profileImg: [null]
    });
    this.contactInfoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.clientProfileForm = this.fb.group({
      userName: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phoneNumber: [{ value: '', disabled: true }, Validators.required],
      profileImg: [{ value: '', disabled: true }],
    });
  }

  ngOnInit() {
    this.accountService.getUserProfile().subscribe({
      next: (data) => {
        console.log("+++++++++++++++++++++++++++++++++");
        
        
        this.profileData = data.Data;
        this.error = null;
        console.log(this.profileData);
        // this.personalInfoForm.patchValue({
          //   fullName: this.profileData.UserName
          // });
          // this.contactInfoForm.patchValue({
            //   email: this.profileData.Email,
            //   phoneNumber: this.profileData.PhoneNumber
        // });
        
if (!this.profileData.ProfileImg) {
  this.profileData.ProfileImg = 'https://via.placeholder.com/150';
}
      },
      error: (err) => {
        this.error = 'Failed to load profile.';
        this.profileData = null;
      }
    });

    // Mock: Populate with example data
    this.personalInfoForm.patchValue({
      fullName: 'NadaMagdy'
    });
    this.contactInfoForm.patchValue({
      email: 'nada@email.com',
      phoneNumber: '+201000000000'
    });
    this.profileImgPreview = 'https://example.com/image.jpg';
    // Store originals for cancel
    this.originalPersonalInfo = { ...this.personalInfoForm.value, profileImgPreview: this.profileImgPreview };
    this.originalContactInfo = { ...this.contactInfoForm.value };

    // Mock: Populate with example data for client profile
    this.clientProfileForm.patchValue({
      userName: 'NadaMagdy',
      email: 'nada@email.com',
      phoneNumber: '+201000000000',
      profileImg: 'https://example.com/image.jpg',
    });
    this.originalClientProfile = { ...this.clientProfileForm.value };
  }

  // Personal Info
  onProfileImgChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.profileImgPreview = reader.result;
      reader.readAsDataURL(file);
      this.personalInfoForm.patchValue({ profileImg: file });
    }
  }
  editPersonal() { this.editPersonalInfo = true; }
  savePersonalInfo() {
    // TODO: Call AccountService.updateProfile or similar
    this.editPersonalInfo = false;
    this.originalPersonalInfo = { ...this.personalInfoForm.value, profileImgPreview: this.profileImgPreview };
  }
  closePersonalInfo() {
    this.personalInfoForm.patchValue({
      fullName: this.originalPersonalInfo.fullName
    });
    this.profileImgPreview = this.originalPersonalInfo.profileImgPreview;
    this.editPersonalInfo = false;
  }

  // Contact Info
  editContact() { this.editContactInfo = true; }
  saveContactInfo() {
    // TODO: Call AccountService.updateContact or similar
    this.editContactInfo = false;
    this.originalContactInfo = { ...this.contactInfoForm.value };
  }
  closeContactInfo() {
    this.contactInfoForm.patchValue(this.originalContactInfo);
    this.editContactInfo = false;
  }

  // Password
  editPass() { this.editPassword = true; }
  savePassword() {
    // TODO: Call AccountService.changePassword
    this.editPassword = false;
    this.passwordForm.reset();
  }
  closePassword() {
    this.passwordForm.reset();
    this.editPassword = false;
  }

  // Delete Account
  openDeleteDialog() { this.isDeleting = true; }
  closeDeleteDialog() { this.isDeleting = false; }
  confirmDeleteAccount() {
    // TODO: Call AccountService.deleteAccount or show confirmation
    this.isDeleting = false;
  }

  enterEditClientProfile() {
    this.editClientProfile = true;
    this.clientProfileForm.enable();
  }

  saveClientProfile() {
    if (this.clientProfileForm.valid) {
      this.accountService.updateClientProfile(this.clientProfileForm.value).subscribe({
        next: () => {
          this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
          this.editClientProfile = false;
          this.clientProfileForm.disable();
          this.originalClientProfile = { ...this.clientProfileForm.value };
        },
        error: () => {
          this.snackBar.open('Failed to update profile.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  closeClientProfile() {
    this.clientProfileForm.patchValue(this.originalClientProfile);
    this.clientProfileForm.disable();
    this.editClientProfile = false;
  }
}
