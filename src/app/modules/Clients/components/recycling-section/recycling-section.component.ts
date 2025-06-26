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
        console.log('Received requests in component:', requests);
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
      city: '',
      address: '',
      quantity: '',
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
    if (this.requestForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.requestForm.value;
    const request: RecyclingRequestCreateViewModel = {
      materialId: this.selectedMaterial!.Id,
      unitType: this.selectedMaterial!.UnitType,
      city: formValue.city,
      address: formValue.address,
      quantity: formValue.quantity,
      requestImage: this.imageBase64 || undefined,
    };

    this.recyclingService.createRequest(request).subscribe({
      next: (response) => {
        console.log('Request created successfully:', response);
        this.isLoading = false;
        this.successMessage = 'Recycling request created successfully!';
        this.resetForm();

        // Reset form and go back to materials list
        setTimeout(() => {
          this.showMaterials();
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating request:', error);
        this.isLoading = false;
        this.errorMessage =
          'Failed to create recycling request. Please try again.';
      },
    });
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
    this.loadMyRequests();
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
    console.log('Viewing request details for ID:', requestId);

    this.isLoading = true;
    this.errorMessage = '';

    this.recyclingService.getRequestDetails(requestId).subscribe({
      next: (requestDetails) => {
        this.isLoading = false;

        if (requestDetails) {
          // For now, just show the details in a success message
          // Later we can create a modal or separate page
          this.successMessage = `Request #${requestDetails.id} Details: ${
            requestDetails.materialName
          } - Status: ${this.getStatusText(
            requestDetails.status
          )} - Created: ${new Date(
            requestDetails.createdAt
          ).toLocaleDateString()}`;
        } else {
          this.errorMessage = 'Request details not found.';
        }
      },
      error: (error) => {
        console.error('Error fetching request details:', error);
        this.errorMessage = 'Failed to load request details.';
        this.isLoading = false;
      },
    });
  }
}
