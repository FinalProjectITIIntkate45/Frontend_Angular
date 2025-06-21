import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferViewModel } from '../../../Models/OfferViewModel';
import { OfferService } from '../../../Services/OfferServices.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-details',
  templateUrl: './editDetailes.component.html',
  styleUrls: ['./editDetailes.component.css'],
  providers: [DatePipe],
  standalone: false
})
export class EditDetailsComponent implements OnInit {
  offerId!: number;
  offerForm!: FormGroup;
  loading = true;
  saving = false;
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  currentOffer: OfferViewModel | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offerService: OfferService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private http: HttpClient
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.offerId = +this.route.snapshot.paramMap.get('id')!;
    this.loadOfferDetails();
  }

  initForm(): void {
    this.offerForm = this.fb.group({
      status: [true, Validators.required],
      oldPrice: [0, [Validators.required, Validators.min(0)]],
      newPrice: [0, [Validators.required, Validators.min(0)]],
      oldPoints: [0, [Validators.required, Validators.min(0)]],
      newPoints: [0, [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      imageFile: [null]
    });
  }

  loadOfferDetails(): void {
    this.offerService.getOfferDetails(this.offerId).subscribe({
      next: (offer: OfferViewModel) => {
        this.currentOffer = offer;
        
        // Format dates for the form
        const startDate = this.datePipe.transform(offer.StartDate, 'yyyy-MM-ddTHH:mm');
        const endDate = this.datePipe.transform(offer.EndDate, 'yyyy-MM-ddTHH:mm');

        this.offerForm.patchValue({
          status: offer.Status === 1,
          oldPrice: offer.OldPrice,
          newPrice: offer.NewPrice,
          oldPoints: offer.OldPoints,
          newPoints: offer.NewPoints,
          startDate: startDate,
          endDate: endDate
        });

        if (offer.OfferImgUrl) {
          this.previewImage = offer.OfferImgUrl;
        }
        
        this.loading = false;
      },
      error: (err: any) => {
        this.toastr.error('Failed to load offer details');
        this.loading = false;
      }
    });
  }

  getFileNameFromUrl(url: string): string {
    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      return pathname.substring(pathname.lastIndexOf('/') + 1);
    } catch (e) {
      // Fallback for invalid or relative URLs
      return 'offer-image.jpg';
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveChanges(): void {
    if (this.offerForm.invalid) {
      this.toastr.warning('Please fill all required fields correctly');
      return;
    }

    this.saving = true;
    const formValue = this.offerForm.value;

    const offerData: OfferViewModel = {
      Id: this.offerId,
      Status: formValue.status ? 1 : 0,
      OldPrice: formValue.oldPrice,
      NewPrice: formValue.newPrice,
      OldPoints: formValue.oldPoints,
      NewPoints: formValue.newPoints,
      StartDate: new Date(formValue.startDate).toISOString(),
      EndDate: new Date(formValue.endDate).toISOString(),
      file: this.selectedFile || undefined,
      OfferImgUrl: this.currentOffer?.OfferImgUrl || '',
      Products: this.currentOffer?.Products || []
    };

    this.offerService.updateOffer(offerData).subscribe({
      next: () => {
        this.toastr.success('Offer updated successfully');
        this.router.navigate(['/provider/ShowShopOffer']);
      },
      error: (err: any) => {
        this.toastr.error('Failed to update offer');
        console.error('Error updating offer:', err);
        this.saving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/provider/ShowShopOffer']);
  }
}