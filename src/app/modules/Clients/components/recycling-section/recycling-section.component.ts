import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecyclingService } from '../../Services/recycling.service';
import {
  RecyclingMaterial,
  UnitOfMeasurementType,
} from '../../Models/recycling-material.model';
import {
  RecyclingRequestCreateViewModel,
  RecyclingRequestListItemViewModel,
  RecyclingRequestStatus,
} from '../../Models/recycling-request.model';

@Component({
  selector: 'app-recycling-section',
  standalone: false,
  templateUrl: './recycling-section.component.html',
  styleUrls: ['./recycling-section.component.css'],
})
export class RecyclingSectionComponent implements OnInit {
  materials: RecyclingMaterial[] = [];
  myRequests: RecyclingRequestListItemViewModel[] = [];
  selectedMaterial: RecyclingMaterial | null = null;
  showRequestForm = false;
  showMaterialsList = true;
  showMyRequests = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  requestForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  imageBase64: string | null = null;

  constructor(
    private recyclingService: RecyclingService,
    private fb: FormBuilder
  ) {
    this.requestForm = this.fb.group({
      materialId: ['', Validators.required],
      unitType: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0.1)]],
      requestImage: [''],
    });
  }

  ngOnInit(): void {
    this.loadMaterials();
    this.loadMyRequests();
  }

  loadMaterials(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.recyclingService.getAllMaterials().subscribe({
      next: (materials) => {
        this.materials = materials;
        this.isLoading = false;

        if (materials.length === 0) {
          this.errorMessage = 'No recycling materials available at the moment.';
        }
      },
      error: (error) => {
        console.error('Error loading materials:', error);
        this.errorMessage =
          'Failed to load recycling materials. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  loadMyRequests(): void {
    this.recyclingService.getMyRequests().subscribe({
      next: (requests) => {
        this.myRequests = requests;
        // No error message needed since this endpoint is not implemented yet
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        // Don't show error for unimplemented endpoint
      },
    });
  }

  selectMaterial(material: RecyclingMaterial): void {
    this.selectedMaterial = material;
    this.requestForm.patchValue({
      materialId: material.Id,
      unitType: material.UnitType,
    });
    this.showRequestForm = true;
    this.showMaterialsList = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
        // Convert to base64 for sending to backend
        this.imageBase64 = e.target.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.imageBase64 = null;
    this.requestForm.patchValue({ requestImage: '' });
  }

  submitRequest(): void {
    if (this.requestForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const requestData: RecyclingRequestCreateViewModel = {
        materialId: this.requestForm.value.materialId,
        unitType: this.requestForm.value.unitType,
        city: this.requestForm.value.city,
        address: this.requestForm.value.address,
        quantity: this.requestForm.value.quantity,
        requestImage: this.imageBase64 || undefined, // Convert null to undefined
      };

      this.recyclingService.createRequest(requestData).subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.successMessage =
              response.Message || 'Recycling request submitted successfully!';
            this.resetForm();
            this.loadMyRequests();
            this.showMaterialsList = true;
            this.showRequestForm = false;
          } else {
            this.errorMessage =
              response.Message || 'Failed to submit recycling request.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error submitting request:', error);
          this.errorMessage =
            'Failed to submit recycling request. Please try again.';
          this.isLoading = false;
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm(): void {
    this.requestForm.reset();
    this.selectedFile = null;
    this.previewUrl = null;
    this.imageBase64 = null;
    this.selectedMaterial = null;
  }

  markFormGroupTouched(): void {
    Object.keys(this.requestForm.controls).forEach((key) => {
      const control = this.requestForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.showRequestForm = false;
    this.showMaterialsList = true;
    this.resetForm();
  }

  showRequests(): void {
    this.showMyRequests = true;
    this.showMaterialsList = false;
    this.showRequestForm = false;
  }

  showMaterials(): void {
    this.showMyRequests = false;
    this.showMaterialsList = true;
    this.showRequestForm = false;
  }

  getStatusBadgeClass(status: RecyclingRequestStatus): string {
    switch (status) {
      case RecyclingRequestStatus.Pending:
        return 'badge bg-warning';
      case RecyclingRequestStatus.Accepted:
        return 'badge bg-success';
      case RecyclingRequestStatus.Rejected:
        return 'badge bg-danger';
      case RecyclingRequestStatus.Completed:
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusText(status: RecyclingRequestStatus): string {
    switch (status) {
      case RecyclingRequestStatus.Pending:
        return 'Pending';
      case RecyclingRequestStatus.Accepted:
        return 'Accepted';
      case RecyclingRequestStatus.Rejected:
        return 'Rejected';
      case RecyclingRequestStatus.Completed:
        return 'Completed';
      default:
        return 'Unknown';
    }
  }

  getUnitTypeDisplayName(unitType: UnitOfMeasurementType): string {
    return this.recyclingService.getUnitTypeDisplayName(unitType);
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  viewRequestDetails(requestId: number): void {
    // TODO: Implement request details view
    console.log('Viewing request details for ID:', requestId);
    // This could open a modal or navigate to a details page
    this.successMessage = `Viewing details for request #${requestId}`;
  }
}
