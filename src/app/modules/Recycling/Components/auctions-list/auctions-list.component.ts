import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuctionService } from '../../Services/auction.service';
import { WalletService } from '../../Services/wallet.service';
import { AuctionVM, ScrapAuctionStatus } from '../../Models/auction-vm.model';
import { Governorate } from '../../Models/recycling-request.model';
import { Wallet } from '../../Models/wallet.model';

@Component({
  selector: 'app-auctions-list',
  templateUrl: './auctions-list.component.html',
  styleUrls: ['./auctions-list.component.css'],
  standalone: false,
})
export class AuctionsListComponent implements OnInit {
  auctions: AuctionVM[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  ScrapAuctionStatus = ScrapAuctionStatus; // Add enum to class for template
  
  // Pagination
  currentPage = 1;
  pageSize = 10; // 10 elements per page
  totalPages = 1;
  
  // City list for dropdown
  cities: string[] = [
    'Sohag', 'Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Sharqia', 'Gharbia', 
    'Menoufia', 'Dakahlia', 'Beheira', 'KafrElSheikh', 'Damietta', 'PortSaid', 
    'Ismailia', 'Suez', 'MarsaMatrouh', 'NorthSinai', 'SouthSinai', 'Fayoum', 
    'BeniSuef', 'Minya', 'Assiut', 'Qena', 'Luxor', 'Aswan', 'RedSea', 'NewValley'
  ];
  
  // Filters
  filterForm: FormGroup;
  
  // Join Auction Modal
  showJoinModal = false;
  selectedAuction: AuctionVM | null = null;
  isJoining = false;
  
  // Wallet
  userWallet: Wallet | null = null;
  isLoadingWallet = false;

  constructor(
    private auctionService: AuctionService,
    private walletService: WalletService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      city: ['Sohag']
    });
  }

  ngOnInit(): void {
    this.loadAuctions();
    this.loadUserWallet();
    
    // Listen to filter changes
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadAuctions();
    });
  }

  loadAuctions(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const filters = this.filterForm.value;
    const city = filters.city && filters.city.trim() !== '' ? filters.city : 'Sohag';
  
    this.auctionService.getAllAuctions(city, this.pageSize, this.currentPage).subscribe({
      next: (auctions: AuctionVM[]) => {
        this.auctions = auctions;
        this.totalPages = auctions.length < this.pageSize ? this.currentPage : this.currentPage + 1;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load auctions. Please try again.';
        this.isLoading = false;
        console.error('Error loading auctions:', error);
      }
    });
  }

  loadUserWallet(): void {
    this.isLoadingWallet = true;
    this.walletService.getUserWallet().subscribe({
      next: (wallet) => {
        this.userWallet = wallet;
        this.isLoadingWallet = false;
      },
      error: (error) => {
        console.error('Error loading wallet:', error);
        this.isLoadingWallet = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadAuctions();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAuctions();
    }
  }

  canJoinAuction(auction: AuctionVM): boolean {
    return auction.Status === ScrapAuctionStatus.Active;
  }

  openJoinModal(auction: AuctionVM): void {
    this.selectedAuction = auction;
    this.showJoinModal = true;
    this.clearMessages();
  }

  closeJoinModal(): void {
    this.selectedAuction = null;
    this.showJoinModal = false;
    this.clearMessages();
  }

  joinAuction(): void {
    if (!this.selectedAuction) return;

    this.isJoining = true;
    this.clearMessages();
    
    // Check if user has sufficient balance (assuming insurance cost is 100 points)
    const insuranceCost = 100;
    if (this.userWallet && this.userWallet.BalancePoints < insuranceCost) {
      this.errorMessage = `Insufficient points. You need ${insuranceCost} points for insurance. Current balance: ${this.userWallet.BalancePoints} points.`;
      this.isJoining = false;
      return;
    }
    
    this.auctionService.joinAuctionWithInsurance(this.selectedAuction.Id).subscribe({
      next: (response) => {
        this.successMessage = response.Message || 'Successfully joined the auction! Insurance payment processed from your wallet.';
        this.closeJoinModal();
        this.loadAuctions();
        this.loadUserWallet(); // Refresh wallet balance
        this.isJoining = false;
      },
      error: (error: any) => {
        this.errorMessage = error.error?.Message || 'Failed to join auction. Please try again.';
        this.isJoining = false;
        console.error('Error joining auction:', error);
      }
    });
  }

  getGovernorateName(governorate: Governorate): string {
    return Governorate[governorate] || 'Unknown';
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

  formatPrice(price: number): string {
    return price?.toFixed(2) || '0.00';
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

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatPoints(points: number): string {
    return new Intl.NumberFormat('en-US').format(points);
  }

  getInsuranceCost(): number {
    return 100; // Fixed insurance cost in points
  }

  hasSufficientBalance(): boolean {
    if (!this.userWallet) return false;
    return this.userWallet.BalancePoints >= this.getInsuranceCost();
  }

  trackByAuctionId(index: number, auction: AuctionVM): number {
    return auction.Id;
  }

  requestToJoinAuction(auction: AuctionVM): void {
    // Implement your logic here, e.g., call a service to send a join request
    this.auctionService.requestToJoinAuction(auction.Id).subscribe({
      next: (response) => {
        this.successMessage = response.Message || 'Request sent successfully!';
      },
      error: (error) => {
        this.errorMessage = error.error?.Message || 'Failed to send request.';
      }
    });
  }
}