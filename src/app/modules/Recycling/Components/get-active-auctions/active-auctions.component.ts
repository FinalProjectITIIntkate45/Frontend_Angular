import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuctionVM } from '../../Models/AuctionVM';
import { ActiveAuctionsService } from '../../Services/active-auctions.service';
import { NotificationService } from '../../Services/notification.service.service';
import { RecyclingMaterialViewModel } from '../../Models/RecyclingMaterialViewModel';
import { Governorate } from '../../../Clients/Models/recycling-request.model';
import { APIResponse } from '../../../../core/models/APIResponse';

@Component({
  selector: 'app-active-auctions',
  templateUrl: './active-auctions.component.html',
  styleUrls: ['./active-auctions.component.css'],
  standalone: false
})
export class ActiveAuctionsComponent implements OnInit, OnDestroy {
  activeAuctions: AuctionVM[] = [];
  filteredAuctions: AuctionVM[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  
  // Filter properties
  selectedGovernorate?: Governorate;
  selectedMaterial?: RecyclingMaterialViewModel;
  governorates: Governorate[] = Object.values(Governorate).filter(value => typeof value === 'number') as Governorate[];
  materials: RecyclingMaterialViewModel[] = [
    { id: 1, name: 'Plastic', unitType: 'kg', pointsPerUnit: 10 },
    { id: 2, name: 'Metal', unitType: 'kg', pointsPerUnit: 15 },
    { id: 3, name: 'Paper', unitType: 'kg', pointsPerUnit: 5 },
    { id: 4, name: 'Glass', unitType: 'kg', pointsPerUnit: 12 }
  ];

  private subscription = new Subscription();

  constructor(
    private activeAuctionsService: ActiveAuctionsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadActiveAuctions();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSectionChange(section: string) {
    console.log('Section changed to:', section);
    // Handle section changes if needed
  }

  loadActiveAuctions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.subscription.add(
      this.activeAuctionsService.getActiveAuctions().subscribe({
        next: (response: APIResponse<AuctionVM[]>) => {
          if (response.IsSuccess) {
            this.activeAuctions = response.Data;
            this.filteredAuctions = [...this.activeAuctions];
            console.log(`Loaded ${this.activeAuctions.length} active auctions`);
          } else {
            this.errorMessage = response.Message || 'فشل في تحميل المزادات النشطة';
            console.error('API Error:', response.Message);
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          this.errorMessage = 'حدث خطأ في الاتصال بالخادم';
          console.error('Network Error:', error);
          this.isLoading = false;
        }
      })
    );
  }


  viewAuctionDetails(auctionId: number): void {
    this.router.navigateByUrl(`/Recycler/auction-detail/${auctionId}`);  }

  joinAuctionRoom(auctionId: number): void {
    this.router.navigateByUrl(`/Recycler/room/${auctionId}`);  }


  // Utility methods
  getAuctionStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'active';
      case 'pending':
        return 'pending';
      case 'closed':
        return 'closed';
      default:
        return 'unknown';
    }
  }

  formatDate(date: string | Date): string {
    if (!date) return 'غير محدد';
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  refreshAuctions(): void {
    this.loadActiveAuctions();
  }
} 