import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/Auth.service';

@Component({
  selector: 'app-RecyclerSideBar',
  templateUrl: './RecyclerSideBar.component.html',
  styleUrls: ['./RecyclerSideBar.component.css'],
  standalone: false
})
export class RecyclerSideBarComponent implements OnInit {
  @Output() sectionChange = new EventEmitter<string>();
  
  selectedSection: string = 'dashboard';
  
  // Navigation menu items
  menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      route: '/Recycler'
    },
    {
      id: 'auctions',
      label: 'All Auctions',
      icon: 'fas fa-gavel',
      route: '/Recycler/auction-list'
    },
    {
      id: 'active-auctions',
      label: 'Active Auctions',
      icon: 'fas fa-fire',
      route: '/Recycler/active-auctions'
    },
    {
      id: 'requests',
      label: 'Recycler Requests',
      icon: 'fas fa-recycle',
      route: '/Recycler/recycler-requests'
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: 'fas fa-wallet',
      route: '/Recycler/wallet'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'fas fa-bell',
      route: '/Recycler/notification'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Set initial section based on current route
    this.setInitialSection();
  }

  setInitialSection() {
    const currentRoute = this.router.url;
    const menuItem = this.menuItems.find(item => item.route === currentRoute);
    if (menuItem) {
      this.selectedSection = menuItem.id;
    }
  }

  selectSection(section: string) {
    this.selectedSection = section;
    this.sectionChange.emit(section);
    
    // Navigate to the corresponding route
    const menuItem = this.menuItems.find(item => item.id === section);
    if (menuItem) {
      this.router.navigate([menuItem.route]);
    }
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  isActive(section: string): boolean {
    return this.selectedSection === section;
  }
}
