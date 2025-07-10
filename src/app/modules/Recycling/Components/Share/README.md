# Recycler Shared Components

This directory contains shared components for the Recycling module that provide consistent navigation and layout across all recycler pages.

## Components

### 1. RecyclerNavbar Component
**Location**: `RecyclerNavbar/RecyclerNavbar.component.ts`

**Features**:
- Header with title and description
- **Recycler information display** (center name, status, penalties)
- Notification button with badge showing count
- Wallet display (points and cash balance)
- Logout button
- Sliding notification panel
- Responsive design

**Recycler Data Display**:
- Recycling center name with building icon
- Status indicator (Active/Unpaid/Deleted) with color coding
- Penalties count (if any) with warning icon
- Refresh button for recycler data

**Wallet Display**:
- Points balance with coins icon
- Cash balance with dollar sign icon
- Refresh button for wallet data
- Loading states for both wallet and recycler data

**Usage**:
```html
<app-RecyclerNavbar></app-RecyclerNavbar>
```

**Functionality**:
- Connects to NotificationService for real-time notifications
- Uses AuthService for logout functionality
- Uses RecyclerService to fetch recycler data from API
- Uses WalletService to fetch wallet data
- Displays notification count badge
- Toggle notification panel
- Clear all notifications
- Refresh recycler and wallet data

### 2. RecyclerSideBar Component
**Location**: `RecyclerSideBar/RecyclerSideBar.component.ts`

**Features**:
- Navigation menu with icons
- Active section highlighting
- Logout option in footer
- Help center link
- Responsive design

**Usage**:
```html
<app-RecyclerSideBar (sectionChange)="onSectionChange($event)"></app-RecyclerSideBar>
```

**Navigation Items**:
- Dashboard (`/Recycler`)
- All Auctions (`/Recycler/auction-list`)
- Active Auctions (`/Recycler/active-auctions`)
- Recycler Requests (`/Recycler/recycler-requests`)
- Wallet (`/Recycler/wallet`)
- Notifications (`/Recycler/notification`)

**Functionality**:
- Automatic route detection and highlighting
- Navigation between sections
- Logout confirmation
- Section change events

### 3. RecyclerLayout Component
**Location**: `RecyclerLayout/RecyclerLayout.component.ts`

**Features**:
- Combines navbar and sidebar
- Content area with ng-content projection
- Responsive layout
- Proper spacing and positioning

**Usage**:
```html
<app-RecyclerLayout (sectionChange)="onSectionChange($event)">
  <!-- Your page content here -->
  <div class="your-content">
    <h1>Your Page Title</h1>
    <p>Your page content...</p>
  </div>
</app-RecyclerLayout>
```

### 4. RecyclerDemo Component
**Location**: `RecyclerDemo/RecyclerDemo.component.ts`

**Features**:
- Example implementation of the layout
- Demonstrates proper usage
- Feature showcase

**Usage**:
```html
<app-RecyclerDemo></app-RecyclerDemo>
```

## Services Used

### NotificationService
- Real-time notifications via SignalR
- Connection management
- Notification count tracking

### AuthService
- User authentication state
- Logout functionality
- Token management

### RecyclerService
- Fetches recycler data from `/api/Auction/GetRecycler`
- Provides recycler center information
- Status and penalty tracking

### WalletService
- Fetches wallet data from `/api/Wallet/getWallet`
- Provides points and cash balance
- Wallet information management

## Models

### RecyclerVM
```typescript
export interface RecyclerVM {
  recyclingCenterName: string;
  penalties: number;
  isdeleted: boolean;
  ispaid: boolean;
}
```

### Wallet
```typescript
export interface Wallet {
  id: number;
  balancePoints: number;
  balancecash: number;
  lastUpdated: string;
  usertId: string;
  totalShopPoints: number;
  totalFreePoints: number;
  totalPendingPoints: number;
  totalAllPoints: number;
}
```

## Styling

All components use modern CSS with:
- Flexbox and Grid layouts
- Smooth transitions and animations
- Responsive design
- Consistent color scheme
- Box shadows and rounded corners

### Color Coding for Recycler Status:
- **Active**: Green (#2ecc71)
- **Unpaid**: Orange (#e67e22)
- **Deleted**: Red (#e74c3c)
- **Penalties**: Yellow (#f39c12)

## Responsive Design

Components are fully responsive:
- Desktop: Full sidebar and navbar layout with all information displayed
- Mobile: Collapsible sidebar, stacked navbar with compact recycler/wallet info
- Tablet: Adaptive layout adjustments

## Integration

To use these components in your recycler pages:

1. **Simple Usage** (Individual components):
```html
<app-RecyclerNavbar></app-RecyclerNavbar>
<app-RecyclerSideBar (sectionChange)="onSectionChange($event)"></app-RecyclerSideBar>
<!-- Your content -->
```

2. **Layout Usage** (Recommended):
```html
<app-RecyclerLayout (sectionChange)="onSectionChange($event)">
  <!-- Your page content -->
</app-RecyclerLayout>
```

## Events

### sectionChange Event
Emitted when user navigates to a different section:
```typescript
onSectionChange(section: string) {
  console.log('Section changed to:', section);
  // Handle section change
}
```

## API Endpoints

### Recycler Data
- **GET** `/api/Auction/GetRecycler` - Fetches current recycler information
- Returns: `APIResponse<RecyclerVM>`

### Wallet Data
- **GET** `/api/Wallet/getWallet` - Fetches user wallet information
- Returns: `Wallet | null`

## Dependencies

- Angular Common Module
- Angular Router
- RxJS
- Font Awesome (for icons)
- Core services (AuthService, NotificationService, RecyclerService, WalletService)

## Notes

- All components are non-standalone and must be declared in the RecyclingModule
- Components automatically handle service connections and cleanup
- Logout functionality includes confirmation dialogs
- Notification panel includes overlay for mobile devices
- Recycler and wallet data are automatically refreshed when components initialize
- Status indicators provide visual feedback for recycler state
- Penalties are only displayed when count > 0 