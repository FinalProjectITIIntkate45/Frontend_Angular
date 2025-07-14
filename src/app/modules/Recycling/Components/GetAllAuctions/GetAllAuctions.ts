// auction-list.component.ts
import { Component, OnInit } from '@angular/core';
import { AuctionService } from '../../Services/auction.service';
import { AuctionRequestService } from '../../Services/auction-request.service';
import { RecyclerRequestService } from '../../Services/RecyclerRequest.service';
import { AuctionVM } from '../../Models/AuctionVM';
import { AuctionRoomVM } from '../../Models/auction-room-vm';
import { AuctionRecyclingRequestDisplyVM } from '../../Models/auction-request-display';
import { AuctionRecyclingRequestVM } from '../../Models/auction-recycling-request';
import { Router } from '@angular/router';
import { APIResponse } from '../../../../core/models/APIResponse';
import { Governorate } from '../../../Clients/Models/recycling-request.model';

// Extended interface for auctions with request status
interface AuctionWithStatus extends AuctionRoomVM {
  hasAcceptedRequest: boolean;
  hasRequestedToJoin: boolean;
  requestStatus?: number;
}

function mapAuctionPascalToCamel(auction: any): AuctionRoomVM {
  return {
    Id: auction.Id,
    MaterialId: auction.MaterialId,
    Matrialname: auction.Materialname,
    governorate: auction.governorate,
    GovernorateName: auction.GovernorateName,
    StartTime: auction.StartTime,
    EndTime: auction.EndTime,
    Status: auction.Status,
    AuctionStatus: auction.AuctionStatus,
    CreatedAt: auction.CreatedAt,
    InsuranceAmount: auction.InsuranceAmount,
    quantity: auction.quantity || 0,
    UnitType: auction.UnitType || 1,
    RequestsCount: auction.RequestsCount || 0,
  };
}

@Component({
  selector: 'app-get-all-auctions',
  templateUrl: './GetAllAuctions.html',
  styleUrls: ['./GetAllAuctions.css'],
  standalone: false,
})
export class AuctionListComponent implements OnInit {
  auctions: AuctionWithStatus[] = [];
  filteredAuctions: AuctionWithStatus[] = [];
  recyclerRequests: AuctionRecyclingRequestDisplyVM[] = [];
  isLoading: boolean = true;

  // Governorate filter
  selectedGovernorate: string = '';
  governorates: string[] = Object.keys(Governorate).filter(key => isNaN(Number(key)));

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // Template helpers
  Math = Math;
  parseInt = parseInt;

  constructor(
    private auctionService: AuctionService,
    private auctionRequestService: AuctionRequestService,
    private recyclerRequestService: RecyclerRequestService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAuctions();
  }

  onSectionChange(section: string) {
    console.log('Section changed to:', section);
    // Handle section changes if needed
  }

  loadAuctions(): void {
    this.isLoading = true;
    if (this.selectedGovernorate === 'جميع المحافظات') {
      this.auctionService.getAllAuctions().subscribe({
        next: (response: APIResponse<AuctionVM[]>) => {
          this.handleAuctionsResponse(response);
        },
        error: (err: any) => {
          console.error('Error loading auctions:', err);
          this.isLoading = false;
        }
      });
    } else {
      this.auctionService.getAuctionsWithFilters(
        this.selectedGovernorate,
        this.pageSize,
        this.currentPage
      ).subscribe({
        next: (response: APIResponse<AuctionVM[]>) => {
          this.handleAuctionsResponse(response);
        },
        error: (err: any) => {
          console.error('Error loading auctions:', err);
          this.isLoading = false;
        }
      });
    }
  }

  filterByGovernorate(governorate: string) {
    this.selectedGovernorate = governorate;
    this.currentPage = 1;
    this.loadAuctions();
  }

  clearFilters() {
    this.selectedGovernorate = '';
    this.currentPage = 1;
    this.loadAuctions();
  }

  private handleAuctionsResponse(response: APIResponse<AuctionVM[]>): void {
    if (response.IsSuccess) {
      // Convert to extended interface and map to camelCase
      this.auctions = response.Data.map((auction: any) => ({
        ...mapAuctionPascalToCamel(auction),
        hasAcceptedRequest: false,
        hasRequestedToJoin: false,
        requestStatus: undefined
      }));
      this.filteredAuctions = [...this.auctions];

      // Load all recycler requests for the current user
      this.auctionRequestService.getMyRequests().subscribe({
        next: (requests: AuctionRecyclingRequestDisplyVM[]) => {
          console.log('Loaded recycler requests:', requests);
          this.recyclerRequests = requests;
          this.filterAuctions();
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error loading recycler requests:', err);
          this.isLoading = false;
          this.filterAuctions(); // Still show auctions
        }
      });
    } else {
      console.error('Error loading auctions:', response.Message);
      this.isLoading = false;
    }
  }

  filterAuctions(): void {
    // Link auctions with user requests
    this.auctions = this.auctions.map(auction => {
      const userRequest = this.recyclerRequests.find(req => req.auctionId === auction.Id);
      const hasAcceptedRequest = userRequest?.status === 2; // Accepted
      const hasRequestedToJoin = !!userRequest; // Any request exists
      const requestStatus = userRequest?.status;
      
      console.log(`Auction ${auction.Id}: hasRequestedToJoin=${hasRequestedToJoin}, status=${auction.AuctionStatus}, requestStatus=${requestStatus}`);
      
      return { 
        ...auction, 
        hasAcceptedRequest,
        hasRequestedToJoin,
        requestStatus
      };
    });
    this.filteredAuctions = [...this.auctions];
  }

  // Pagination methods
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadAuctions();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadAuctions();
  }

  // Function to check if user can join auction room (has accepted request)
  canJoinAuction(auctionId: number): boolean {
    return this.recyclerRequests.some(req => req.auctionId === auctionId && req.status === 2);
  }

  // Function to navigate to auction room (always available)
  goToAuctionRoom(auctionId: number): void {
    this.router.navigate(['/Recycler/room', auctionId]);
  }
  viewAuctionDetails(auctionId: number): void {
    this.router.navigate(['/Recycler/auction-detail', auctionId]);
  }
  // Function to join auction (request to join)
  joinAuction(auctionId: number): void {
    const formData = new FormData();
    formData.append('auctionId', auctionId.toString());
    
    this.auctionRequestService.joinAuction(formData).subscribe({
      next: (response) => {
        if (response.success || response.statusCode === 200) {
          alert(response.data || response.message || 'تم إرسال طلب الانضمام بنجاح!');
          this.loadAuctions(); // Refresh the list
        } else {
          alert(response.message || 'فشل في إرسال طلب الانضمام');
        }
      },
      error: (error) => {
        console.error('Error joining auction:', error);
        alert(error?.error?.message || error?.message || 'حدث خطأ أثناء إرسال طلب الانضمام');
      }
    });
  }

  // Function to check if user has already requested to join
  hasRequestedToJoin(auctionId: number): boolean {
    return this.recyclerRequests.some(req => req.auctionId === auctionId);
  }

  // Refresh auctions
  refreshAuctions(): void {
    this.loadAuctions();
  }

  // Alternative method to request joining auction
  requestToJoinAuction(auctionId: number): void {
    console.log('Requesting to join auction:', auctionId);
  
    const request: AuctionRecyclingRequestVM = {
      auctionId: auctionId,
      approvalTime: undefined
    };
  
    this.recyclerRequestService.createRequestToJoin(request).subscribe({
      next: (res) => {
        console.log('Request response:', res);
  
        // نتأكد إن الاستجابة موجودة وفيها statusCode
        if (res && res.statusCode === 200) {
          alert(res.message || 'تم إرسال طلب الانضمام بنجاح!');
          this.loadAuctions();
        } else {
          alert('فشل في إرسال الطلب: ' + (res?.message || 'خطأ غير معروف'));
        }
      },
      error: (err) => {
        console.error('Error requesting to join:', err);
        alert('حدث خطأ أثناء إرسال الطلب: ' + (err?.error?.message || err?.message || ''));
      }
    });
  }
  
  

  // Test method for debugging
  testJoinAuction(auctionId: number): void {
    console.log('Testing join auction:', auctionId);
    
    // Try both services
    const formData = new FormData();
    formData.append('auctionId', auctionId.toString());
    
    this.auctionRequestService.joinAuction(formData).subscribe({
      next: (response) => {
        console.log('AuctionRequestService response:', response);
        if (response.success) {
          alert('تم إرسال طلب الانضمام بنجاح! (طريقة 1)');
          this.loadAuctions();
        } else {
          alert('فشل في إرسال طلب الانضمام: ' + response.message);
        }
      },
      error: (error) => {
        console.error('AuctionRequestService error:', error);
        // Try alternative method
        this.requestToJoinAuction(auctionId);
      }
    });
  }

  // Get request status text
  getRequestStatusText(status?: number): string {
    if (!status) return '';
    
    switch (status) {
      case 1:
        return 'في انتظار الموافقة';
      case 2:
        return 'تمت الموافقة';
      case 3:
        return 'مرفوض';
      default:
        return 'غير معروف';
    }
  }

  // Get request status class
  getRequestStatusClass(status?: number): string {
    if (!status) return '';
    
    switch (status) {
      case 1:
        return 'status-pending';
      case 2:
        return 'status-accepted';
      case 3:
        return 'status-rejected';
      default:
        return 'status-default';
    }
  }

  getUnitTypeDisplayName(unitType: number): string {
    switch (unitType) {
      case 1:
        return 'كيلوجرام';
      case 2:
        return 'جرام';
      case 3:
        return 'لتر';
      case 4:
        return 'مليلتر';
      case 5:
        return 'قطعة';
      case 6:
        return 'متر';
      case 7:
        return 'سنتيمتر';
      default:
        return 'وحدة غير معروفة';
    }
  }
}