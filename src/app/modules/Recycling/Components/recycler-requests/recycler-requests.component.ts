import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecyclerRequestService } from '../../Services/RecyclerRequest.service';
import { AuctionRecyclingRequestDisplyVM } from '../../Models/auction-request-display';
import { JoinAuctionViewModel, AuctionRecyclingStatus } from '../../Models/auction-recycling-request';

@Component({
  selector: 'app-recycler-requests',
  templateUrl: './recycler-requests.component.html',
  styleUrls: ['./recycler-requests.component.css'],
  standalone: false,
})
export class RecyclerRequestsComponent implements OnInit {
  requests: AuctionRecyclingRequestDisplyVM[] = [];
  loading: boolean = false;
  error: string = '';
  selectedStatus: number | 'all' = 'all';

  constructor(
    private recyclerRequestService: RecyclerRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  onSectionChange(section: string) {
    console.log('Section changed to:', section);
    // Handle section changes if needed
  }

  loadRequests(): void {
    this.loading = true;
    this.error = '';

    this.recyclerRequestService.getRecyclerRequests().subscribe({
      next: (requests: any[]) => {
        // Map backend PascalCase to frontend camelCase
        this.requests = requests.map(item => ({
          recyclingRequestId: item.RecyclingRequestId,
          auctionId: item.AuctionId,
          status: item.Status,
          insuranceAmount: item.InsuranceAmount,
          approvalTime: item.ApprovalTime,
          matrialName: item.matrialName, // Note: backend uses 'matrialName' (typo?)
          city: item.city
        }));
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading requests:', error);
        this.error = 'Failed to load requests. Please try again.';
        this.loading = false;
      }
    });
  }

  withdrawRequest(recyclingRequestId: number, auctionId: number): void {
    if (confirm('Are you sure you want to withdraw this request?')) {
      const model: JoinAuctionViewModel = {
        recyclingRequestId: recyclingRequestId,
        auctionId: auctionId
      };

      this.recyclerRequestService.withdrawRequest(model).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Request withdrawn successfully');
            this.loadRequests(); // Reload the requests
          } else {
            alert(response.message || 'Failed to withdraw request');
          }
        },
        error: (error) => {
          console.error('Error withdrawing request:', error);
          alert('Failed to withdraw request. Please try again.');
        }
      });
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case AuctionRecyclingStatus.Pending:
        return 'status-pending';
      case AuctionRecyclingStatus.Accepted:
        return 'status-accepted';
      case AuctionRecyclingStatus.Rejected:
        return 'status-rejected';
      case AuctionRecyclingStatus.Completed:
        return 'status-completed';
      default:
        return 'status-default';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case AuctionRecyclingStatus.Pending:
        return 'Pending';
      case AuctionRecyclingStatus.Accepted:
        return 'Accepted';
      case AuctionRecyclingStatus.Rejected:
        return 'Rejected';
      case AuctionRecyclingStatus.Completed:
        return 'Completed';
      default:
        return 'Unknown';
    }
  }

  getFilteredRequests(): AuctionRecyclingRequestDisplyVM[] {
    if (this.selectedStatus === 'all') {
      return this.requests;
    }
    return this.requests.filter(request => request.status === this.selectedStatus);
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusIcon(status: number): string {
    switch (status) {
      case AuctionRecyclingStatus.Pending:
        return '⏳';
      case AuctionRecyclingStatus.Accepted:
        return '✅';
      case AuctionRecyclingStatus.Rejected:
        return '❌';
      case AuctionRecyclingStatus.Completed:
        return '🏁';
      default:
        return '❓';
    }
  }

  viewAuctionDetails(auctionId: number): void {
    this.router.navigate(['/Recycler/auction-detail', auctionId]);
  }

  getPendingCount(): number {
    return this.requests.filter(r => r.status === AuctionRecyclingStatus.Pending).length;
  }

  getAcceptedCount(): number {
    return this.requests.filter(r => r.status === AuctionRecyclingStatus.Accepted).length;
  }

  getRejectedCount(): number {
    return this.requests.filter(r => r.status === AuctionRecyclingStatus.Rejected).length;
  }

  getCompletedCount(): number {
    return this.requests.filter(r => r.status === AuctionRecyclingStatus.Completed).length;
  }

  onStatusChange(event: any): void {
    const value = event.target.value;
    if (value === 'all') {
      this.selectedStatus = 'all';
    } else {
      this.selectedStatus = parseInt(value);
    }
  }
} 