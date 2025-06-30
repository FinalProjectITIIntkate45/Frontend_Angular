import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuctionService } from '../../Services/auction.service';
import { AuctionVM, ScrapAuctionStatus } from '../../Models/auction-vm.model';

@Component({
  selector: 'app-recycler-dashboard',
  templateUrl: './recycler-dashboard.component.html',
  styleUrls: ['./recycler-dashboard.component.css'],
  standalone: false,
})
export class RecyclerDashboardComponent implements OnInit {
  // Dashboard statistics
  totalAuctions = 0;
  activeAuctions = 0;
  joinedAuctions = 0;
  completedAuctions = 0;
  
  // Recent auctions
  recentAuctions: AuctionVM[] = [];
  
  // Loading states
  isLoading = false;
  errorMessage = '';
  
  // Wallet display state
  showWallet = false;
  
  // User info (you can extend this based on your auth service)
  userName = 'Recycler';
  userLocation = 'Sohag';
  role = '';
  username = '';
  email = '';
  token = '';

  constructor(
    private auctionService: AuctionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.role = user.role || '';
    this.username = user.username || '';
    this.email = user.email || '';
    this.token = localStorage.getItem('token') || '';
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Load recent auctions for the dashboard
    this.auctionService.getAllAuctions(this.userLocation, 5, 1).subscribe({
      next: (auctions: AuctionVM[]) => {
        this.recentAuctions = auctions;
        this.calculateStatistics(auctions);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load dashboard data. Please try again.';
        this.isLoading = false;
        console.error('Error loading dashboard data:', error);
      }
    });
  }

  calculateStatistics(auctions: AuctionVM[]): void {
    this.totalAuctions = auctions.length;
    this.activeAuctions = auctions.filter(a => a.Status === ScrapAuctionStatus.Active).length;
    this.joinedAuctions = auctions.filter(a => a.Status === ScrapAuctionStatus.Completed).length;
    this.completedAuctions = auctions.filter(a => a.Status === ScrapAuctionStatus.Completed).length;
  }

  navigateToAuctionsList(): void {
    this.router.navigate(['/Recycler/AuctionRequest']);
  }

  toggleWalletDisplay(): void {
    this.showWallet = !this.showWallet;
  }

  navigateToAuctionDetails(auctionId: number): void {
    // You can implement this if you have a detailed view
    console.log('Navigate to auction details:', auctionId);
  }

  getStatusBadgeClass(status: ScrapAuctionStatus): string {
    switch (status) {
      case ScrapAuctionStatus.Active:
        return 'badge bg-success';
      case ScrapAuctionStatus.Completed:
        return 'badge bg-primary';
      case ScrapAuctionStatus.Canceled:
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusText(status: ScrapAuctionStatus): string {
    switch (status) {
      case ScrapAuctionStatus.Active:
        return 'Active';
      case ScrapAuctionStatus.Completed:
        return 'Completed';
      case ScrapAuctionStatus.Canceled:
        return 'Canceled';
      default:
        return 'Unknown';
    }
  }

  formatDate(date: string | Date): string {
    return date ? new Date(date).toLocaleDateString() : '';
  }

  getTimeRemaining(endDate: string | Date): string {
    if (!endDate) return 'Invalid date';
    
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Ended';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  }

  trackByAuctionId(index: number, auction: AuctionVM): number {
    return auction.Id;
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/account/login']);
  }
} 