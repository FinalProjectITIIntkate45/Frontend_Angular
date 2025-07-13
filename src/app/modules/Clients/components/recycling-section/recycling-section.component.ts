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
  Governorate,
  RecyclingRequestAfterAuctionVm,
  ReturnType,
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
  requestsAfterAuction: RecyclingRequestAfterAuctionVm[] = [];
  selectedMaterial: RecyclingMaterial | null = null;
  showRequestForm = false;
  showMaterialsList = true;
  showMyRequests = false;
  showRequestsAfterAuction = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  requestForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  imageBase64: string | null = null;
  governorates = Object.values(Governorate).filter(v => typeof v === 'number');
  Governorate = Governorate;
  ReturnType = ReturnType;

  pageNumber = 1;
  pageSize = 10;

  constructor(
    private recyclingService: RecyclingService,
    private fb: FormBuilder
  ) {
    this.requestForm = this.fb.group({
      city: ['', Validators.required],
      address: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0.1)]],
      requestImage: [''],
      governorate: [null, Validators.required],
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
    this.isLoading = true;
    this.errorMessage = '';
    
    this.recyclingService.getMyRequests(this.pageNumber, this.pageSize).subscribe({
      next: (requests) => {
        console.log('Received requests:', requests);
        this.myRequests = requests;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        this.errorMessage = 'Error loading requests';
        this.isLoading = false;
      },
    });
  }

  selectMaterial(material: RecyclingMaterial): void {
    this.selectedMaterial = material;
    this.requestForm.patchValue({
      city: '',
      address: '',
      quantity: '',
      governorate: null,
    });
    this.showRequestForm = true;
    this.showMaterialsList = false;
    this.clearMessages();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File size must be less than 5MB';
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Only image files are allowed';
        return;
      }

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
    if (this.requestForm.invalid || !this.selectedMaterial) {
      this.markFormGroupTouched();
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.requestForm.value;
    const request: RecyclingRequestCreateViewModel = {
      MaterialId: this.selectedMaterial.Id,
      UnitType: this.selectedMaterial.UnitType,
      City: formValue.city,
      Address: formValue.address,
      Quantity: parseFloat(formValue.quantity),
      RequestImage: this.imageBase64 || undefined,
      Governorate: parseInt(formValue.governorate),
    };

    console.log('Submitting request:', request);

    this.recyclingService.createRequest(request).subscribe({
      next: (response) => {
        console.log('Request created successfully:', response);
        this.isLoading = false;
        
        if (response.IsSuccess) {
          this.successMessage = response.Message || 'Recycling request created successfully!';
          this.resetForm();
          
          // Reload requests to show the new one
          this.loadMyRequests();

          // Reset form and go back to materials list after a delay
          setTimeout(() => {
            this.showMaterials();
          }, 2000);
        } else {
          this.errorMessage = response.Message || 'Failed to create recycling request';
        }
      },
      error: (error) => {
        console.error('Error creating request:', error);
        this.isLoading = false;
        
        // Handle different error types
        if (error.status === 400 && error.error?.Message) {
          this.errorMessage = error.error.Message;
        } else if (error.status === 401) {
          this.errorMessage = 'You are not authorized. Please log in again.';
        } else {
          this.errorMessage = 'Failed to create recycling request. Please try again.';
        }
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
    this.clearMessages();
  }

  showRequests(): void {
    this.showMyRequests = true;
    this.showMaterialsList = false;
    this.showRequestForm = false;
    this.clearMessages();
    this.loadMyRequests();
  }

  showMaterials(): void {
    this.showMyRequests = false;
    this.showRequestsAfterAuction = false;
    this.showMaterialsList = true;
    this.showRequestForm = false;
    this.clearMessages();
  }

  showRequestsAfterAuctionSection(): void {
    this.showMyRequests = false;
    this.showMaterialsList = false;
    this.showRequestForm = false;
    this.showRequestsAfterAuction = true;
    this.clearMessages();
    this.loadRequestsAfterAuction();
  }

  loadRequestsAfterAuction(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.recyclingService.getRequestAfterAuction().subscribe({
      next: (requests) => {
        console.log('Received requests after auction:', requests);
        this.requestsAfterAuction = requests;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading requests after auction:', error);
        this.errorMessage = 'Error loading requests after auction';
        this.isLoading = false;
      },
    });
  }

  getReturnTypeText(returnType: ReturnType): string {
    switch (returnType) {
      case ReturnType.Waiting:
        return 'Waiting';
      case ReturnType.Point:
        return 'Points';
      case ReturnType.Money:
        return 'Money';
      default:
        return 'Unknown';
    }
  }

  getReturnTypeBadgeClass(returnType: ReturnType): string {
    switch (returnType) {
      case ReturnType.Waiting:
        return 'badge bg-warning';
      case ReturnType.Point:
        return 'badge bg-success';
      case ReturnType.Money:
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  }

  chooseReturnType(returnType: ReturnType, requestId: number): void {
    if (!confirm(`Are you sure you want to choose ${this.getReturnTypeText(returnType)} as your return type?`)) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.recyclingService.chooseReturnType(returnType, requestId).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.IsSuccess) {
          this.successMessage = response.Message || 'Return type updated successfully!';
          // Reload the requests after auction to show updated data
          this.loadRequestsAfterAuction();
        } else {
          this.errorMessage = response.Message || 'Failed to update return type';
        }
      },
      error: (error) => {
        console.error('Error choosing return type:', error);
        this.isLoading = false;
        
        if (error.status === 404) {
          this.errorMessage = 'Request not found or already processed.';
        } else if (error.status === 401) {
          this.errorMessage = 'You are not authorized to perform this action.';
        } else {
          this.errorMessage = 'Failed to update return type. Please try again.';
        }
      },
    });
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
          // Create a detailed message with request information
          const statusText = this.getStatusText(requestDetails.Status);
          const createdDate = new Date(requestDetails.CreatedAt).toLocaleDateString();
          const pointsText = requestDetails.PointsAwarded ? 
            ` - Points Awarded: ${requestDetails.PointsAwarded}` : '';
          
          this.successMessage = `Request #${requestDetails.Id} Details: 
            Material: ${requestDetails.MaterialName}, 
            Quantity: ${requestDetails.Quantity} ${this.getUnitTypeDisplayName(requestDetails.UnitType).toLowerCase()}, 
            Status: ${statusText}, 
            Created: ${createdDate}${pointsText}`;
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

  nextPage(): void {
    this.pageNumber++;
    this.loadMyRequests();
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadMyRequests();
    }
  }

  deleteRequest(requestId: number): void {
    if (!confirm('Are you sure you want to delete this request?')) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.recyclingService.deleteRequest(requestId).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.IsSuccess) {
          this.successMessage = response.Message || 'Request deleted successfully!';
          this.loadMyRequests(); // Reload the list
        } else {
          this.errorMessage = response.Message || 'Failed to delete request';
        }
      },
      error: (error) => {
        console.error('Error deleting request:', error);
        this.isLoading = false;
        
        if (error.status === 404) {
          this.errorMessage = 'Request not found or already deleted.';
        } else if (error.status === 401) {
          this.errorMessage = 'You are not authorized to delete this request.';
        } else {
          this.errorMessage = 'Failed to delete request. Please try again.';
        }
      },
    });
  }
}